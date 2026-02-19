import 'dotenv/config';
import fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyAuth from '@fastify/auth';
import pino from 'pino';
import { registerRbac } from './application/middleware/rbac';
import { createSafeQueryParser } from './infrastructure/parsers/QueryParser';
import { MongoRepository } from './infrastructure/repositories/MongoRepository';
import { MongoConnectionManager } from './infrastructure/drivers/MongoConnectionManager';

// Load environment variables
const PORT = parseInt(process.env.PORT || '15240', 10);
const HOST = process.env.HOST || '0.0.0.0';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'test';
const RBAC_CONFIG_PATH = process.env.RBAC_CONFIG_PATH || './src/shared/config/rbac.yaml';
const LOG_LEVEL = (process.env.LOG_LEVEL as pino.Level) || 'info';
const NODE_ENV = process.env.NODE_ENV || 'production';

// Build logger options compatible with Fastify's PinoLoggerOptions
const loggerOpts: any = { level: LOG_LEVEL };
if (NODE_ENV === 'development') {
    loggerOpts.transport = { target: 'pino-pretty' };
}

// Initialize Fastify with logger
const server = fastify({ logger: loggerOpts });

// Register Swagger for API documentation
server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Generic MongoDB Data Proxy',
            description: 'A secure, high‑performance proxy for MongoDB with RBAC and dynamic query parsing.',
            version: '1.0.0',
        },
        servers: [{ url: `http://${HOST}:${PORT}` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
});

server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

// Register authentication plugin (required by RBAC)
server.register(fastifyAuth);

// Register RBAC middleware (hook)
server.register(async (instance, _opts, done) => {
    try {
        await registerRbac(instance, RBAC_CONFIG_PATH);
        done();
    } catch (err) {
        instance.log.error({ err }, 'Failed to load RBAC middleware');
        done(err as Error);
    }
});

// Health check endpoint
server.get('/health', async (_request, reply) => {
    try {
        const manager = MongoConnectionManager.getInstance();
        // Try to connect to MongoDB (if not already connected)
        await manager.connect(MONGODB_URI, MONGODB_DATABASE);
        const db = manager.getDb(MONGODB_URI, MONGODB_DATABASE);
        // Ping the database
        await db.command({ ping: 1 });
        reply.send({
            status: 'ok',
            timestamp: new Date().toISOString(),
            mongodb: 'connected',
        });
    } catch (err) {
        server.log.error({ err }, 'Health check failed');
        reply.code(503).send({
            status: 'error',
            timestamp: new Date().toISOString(),
            mongodb: 'disconnected',
            error: (err as Error).message,
        });
    }
});

// Generic collection endpoint: GET /api/v1/:collection
server.get('/api/v1/:collection', async (request, reply) => {
    const { collection } = request.params as { collection: string };
    const query = request.query as Record<string, string | string[]>;

    // Parse query parameters
    const parser = createSafeQueryParser(); // optionally pass allowed fields
    const parsed = parser.parse(query);

    // Create repository for the collection (dynamic)
    const repository = new MongoRepository<any>(MONGODB_URI, MONGODB_DATABASE, collection);

    try {
        // Build FindOptions, omit projection if undefined
        const findOptions: any = {
            sort: parsed.sort,
            limit: parsed.limit,
            skip: parsed.skip,
        };
        if (parsed.projection !== undefined) {
            findOptions.projection = parsed.projection;
        }
        const documents = await repository.find(parsed.filter, findOptions);
        reply.send({
            data: documents,
            meta: {
                total: await repository.count(parsed.filter),
                limit: parsed.limit,
                skip: parsed.skip,
            },
        });
    } catch (err) {
        server.log.error({ err }, `Error fetching documents from ${collection}`);
        reply.code(500).send({ error: 'Internal server error' });
    }
});

// Generic document creation endpoint: POST /api/v1/:collection
server.post('/api/v1/:collection', async (request, reply) => {
    const { collection } = request.params as { collection: string };
    const body = request.body as Record<string, any>;

    const repository = new MongoRepository<any>(MONGODB_URI, MONGODB_DATABASE, collection);
    try {
        const result = await repository.insertOne(body);
        reply.code(201).send({
            acknowledged: result.acknowledged,
            insertedId: result.insertedId,
        });
    } catch (err) {
        server.log.error({ err }, `Error inserting document into ${collection}`);
        reply.code(500).send({ error: 'Internal server error' });
    }
});

// Generic document update endpoint: PUT /api/v1/:collection/:id
server.put('/api/v1/:collection/:id', async (request, reply) => {
    const { collection, id } = request.params as { collection: string; id: string };
    const body = request.body as Record<string, any>;

    const repository = new MongoRepository<any>(MONGODB_URI, MONGODB_DATABASE, collection);
    try {
        const result = await repository.updateOne({ _id: id }, body, { upsert: false });
        if (result.matchedCount === 0) {
            reply.code(404).send({ error: 'Document not found' });
            return;
        }
        reply.send({
            acknowledged: result.acknowledged,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        });
    } catch (err) {
        server.log.error({ err }, `Error updating document ${id} in ${collection}`);
        reply.code(500).send({ error: 'Internal server error' });
    }
});

// Generic document deletion endpoint: DELETE /api/v1/:collection/:id
server.delete('/api/v1/:collection/:id', async (request, reply) => {
    const { collection, id } = request.params as { collection: string; id: string };

    const repository = new MongoRepository<any>(MONGODB_URI, MONGODB_DATABASE, collection);
    try {
        const result = await repository.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            reply.code(404).send({ error: 'Document not found' });
            return;
        }
        reply.send({
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        server.log.error({ err }, `Error deleting document ${id} from ${collection}`);
        reply.code(500).send({ error: 'Internal server error' });
    }
});

// Start the server
const start = async () => {
    try {
        await server.listen({ port: PORT, host: HOST });
        server.log.info(`Server listening on ${HOST}:${PORT}`);
        server.log.info(`Swagger documentation available at http://${HOST}:${PORT}/docs`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
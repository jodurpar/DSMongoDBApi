import fastify, { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyAuth from '@fastify/auth';
import pino from 'pino';
import { registerRbac } from '../../application/middleware/rbac';
import { registerGenericRoutes } from './routes/genericRoutes';

export interface AppConfig {
    port: number;
    host: string;
    reportedHost: string;
    mongodbUri: string;
    mongodbDatabase: string;
    rbacConfigPath: string;
    logLevel: pino.Level;
    nodeEnv: string;
}

/**
 * Creates and configures the Fastify server instance.
 */
export async function createServer(config: AppConfig): Promise<FastifyInstance> {
    const loggerOpts: any = { level: config.logLevel };
    if (config.nodeEnv === 'development') {
        loggerOpts.transport = { target: 'pino-pretty' };
    }

    const server = fastify({ logger: loggerOpts });

    // 1. Register Swagger Base
    await server.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Generic MongoDB Data Proxy',
                description: 'A secure, high-performance proxy for MongoDB with RBAC and dynamic query parsing.',
                version: '2.0.0',
            },
            servers: [
                { url: `http://${config.reportedHost}:${config.port}`, description: 'Local Development' }
            ]
        },
    });

    // 2. Register Swagger UI
    await server.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: true
        },
        transformStaticCSP: () =>
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"
    });

    // 3. Register Authentication & RBAC
    await server.register(fastifyAuth);
    await registerRbac(server, config.rbacConfigPath);

    // 4. Register API Routes (BEFORE listen, within createServer)
    await registerGenericRoutes(server, config.mongodbUri, config.mongodbDatabase, config.reportedHost, config.port);

    return server;
}

import { FastifyInstance } from 'fastify';
import { CollectionController } from '../../../api/controllers/CollectionController';
import { MongoConnectionManager } from '../../drivers/MongoConnectionManager';

export async function registerGenericRoutes(
    server: FastifyInstance,
    mongodbUri: string,
    mongodbDatabase: string
) {
    console.log('[ROUTES] Registering routes...');

    // 0. Diagnostic Route
    server.get('/WhoAmI', async () => {
        return { version: '2.1.0-DIAGNOSTIC', buildDate: new Date().toISOString(), message: 'I AM THE NEW CODE' };
    });
    console.log('[ROUTES] Diagnostic route registered.');

    const controller = new CollectionController(mongodbUri, mongodbDatabase);

    // 1. HealthCheck (Matches TestMe.md structure)
    server.get('/Health', {
        schema: {
            description: 'Health check endpoint as described in TestMe.md',
            summary: 'Health Check',
            tags: ['monitoring'],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        responseCode: { type: 'number' },
                        status: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                api: {
                                    type: 'object',
                                    properties: {
                                        apiName: { type: 'string' },
                                        apiVersion: { type: 'string' },
                                        apiSupportedVersions: { type: 'array', items: { type: 'string' } },
                                        apiHost: { type: 'string' },
                                        apiPort: { type: 'string' },
                                        apiDescription: { type: 'string' }
                                    }
                                },
                                databases: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            connectionName: { type: 'string' },
                                            databaseName: { type: 'string' },
                                            url: { type: 'string' },
                                            status: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (request) => {
        const port = process.env.PORT || '15240';
        const host = process.env.API_HOST_NAME || 'localhost';

        const manager = MongoConnectionManager.getInstance();
        let dbList: string[] = [];
        try {
            dbList = await manager.listDatabases(mongodbUri);
        } catch (err) {
            request.log.error({ err }, 'Could not list databases');
            dbList = [mongodbDatabase]; // Fallback
        }

        return {
            responseCode: 200,
            status: 'Ok',
            data: {
                api: {
                    apiName: 'dsMongoDBApi',
                    apiVersion: '2.0.0',
                    apiSupportedVersions: ['1.0.0'],
                    apiHost: host,
                    apiPort: port,
                    apiDescription: 'Demonstrating how to describe a RESTful API with Fastify, MongoDb, Swagger and Pino logs'
                },
                databases: dbList.map(name => ({
                    connectionName: 'Primary',
                    databaseName: name,
                    url: mongodbUri.replace(/\/\/.*@/, '//****:****@'),
                    status: 'Ok'
                }))
            }
        };
    });

    // Compatibility redirect
    server.get('/health', async (request, reply) => reply.redirect('/Health'));

    // 2. TestMessages (Echo feature)
    server.get('/TestMessages/:message', {
        schema: {
            description: 'Echo back a test message',
            summary: 'Test Echo',
            params: {
                type: 'object',
                properties: { message: { type: 'string' } }
            }
        }
    }, async (request) => {
        const { message } = request.params as { message: string };
        return {
            responseCode: 200,
            status: 'Ok',
            data: `TestMessages: 1.0.0 Recieved: ${message}`
        };
    });

    // 3. Documents CRUD (Query-params based, as per TestMe.md)
    server.get('/Documents', {
        schema: {
            summary: 'Get Documents (TestMe Style)',
            tags: ['documents'],
            querystring: {
                type: 'object',
                properties: {
                    database: { type: 'string' },
                    collection: { type: 'string' },
                    filter: { type: 'string' },
                    selectedFields: { type: 'string' }
                },
                required: ['database', 'collection']
            }
        }
    }, controller.getDocuments.bind(controller));

    server.put('/Documents', {
        schema: {
            summary: 'Add Document (TestMe Style)',
            tags: ['documents'],
            querystring: {
                type: 'object',
                properties: {
                    database: { type: 'string' },
                    collection: { type: 'string' }
                },
                required: ['database', 'collection']
            }
        }
    }, controller.putDocument.bind(controller));

    server.patch('/Documents', {
        schema: {
            summary: 'Update Documents (TestMe Style)',
            tags: ['documents'],
            querystring: {
                type: 'object',
                properties: {
                    database: { type: 'string' },
                    collection: { type: 'string' },
                    filter: { type: 'string' },
                    options: { type: 'string' }
                },
                required: ['database', 'collection']
            }
        }
    }, controller.patchDocuments.bind(controller));

    server.delete('/Documents', {
        schema: {
            summary: 'Delete Documents (TestMe Style)',
            tags: ['documents'],
            querystring: {
                type: 'object',
                properties: {
                    database: { type: 'string' },
                    collection: { type: 'string' },
                    filter: { type: 'string' }
                },
                required: ['database', 'collection']
            }
        }
    }, controller.deleteDocuments.bind(controller));


    // 5. RESTful V2 routes (v1 prefix)
    server.get('/api/v1/:collection', controller.list.bind(controller));
    server.post('/api/v1/:collection', controller.create.bind(controller));
    server.put('/api/v1/:collection/:id', controller.update.bind(controller));
    server.delete('/api/v1/:collection/:id', controller.delete.bind(controller));

    console.log('[ROUTES] Routes registered complete.');
}

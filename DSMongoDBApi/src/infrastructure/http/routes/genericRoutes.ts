import { FastifyInstance } from 'fastify';
import { CollectionController } from '../../../api/controllers/CollectionController';
import { MongoConnectionManager } from '../../drivers/MongoConnectionManager';

export async function registerGenericRoutes(
    server: FastifyInstance,
    mongodbUri: string,
    mongodbDatabase: string,
    reportedHost: string,
    port: number
) {
    console.log('[ROUTES] Registering routes...');

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
                    apiHost: reportedHost,
                    apiPort: String(port),
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

    // 2. Documents CRUD (Query-params based, as per TestMe.md)
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
            description: 'Inserts a new document into the specified collection. The request body is the JSON document to insert.',
            tags: ['documents'],
            querystring: {
                type: 'object',
                properties: {
                    database: { type: 'string', description: 'Target database name' },
                    collection: { type: 'string', description: 'Target collection name' }
                },
                required: ['database', 'collection']
            },
            body: {
                type: 'object',
                description: 'The JSON document to insert. Any valid JSON object is accepted.',
                additionalProperties: true
            },
            response: {
                200: {
                    description: 'Document inserted successfully',
                    type: 'object',
                    properties: {
                        _id: { type: 'string', description: 'The generated ObjectId of the new document' }
                    },
                    additionalProperties: true
                }
            }
        }
    }, controller.putDocument.bind(controller));

    server.patch('/Documents', {
        schema: {
            summary: 'Update Documents (TestMe Style)',
            description: 'Updates documents matching the filter. The request body is the $set update object. Add `options={"multi":"true"}` to update all matching documents.',
            tags: ['documents'],
            querystring: {
                type: 'object',
                properties: {
                    database: { type: 'string', description: 'Target database name' },
                    collection: { type: 'string', description: 'Target collection name' },
                    filter: { type: 'string', description: 'JSON filter object (URL-encoded). Example: {"_id":"..."} ' },
                    options: { type: 'string', description: 'JSON options object. Use {"multi":"true"} to update all matches.' }
                },
                required: ['database', 'collection']
            },
            body: {
                type: 'object',
                description: 'Fields to update ($set). Any valid JSON object with the fields to modify.',
                additionalProperties: true
            },
            response: {
                200: {
                    description: 'Update result',
                    type: 'object',
                    properties: {
                        acknowledged: { type: 'boolean' }
                    },
                    additionalProperties: true
                }
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

    console.log('[ROUTES] Routes registered complete.');
}

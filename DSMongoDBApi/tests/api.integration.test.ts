import { FastifyInstance } from 'fastify';
import { createServer } from '../src/infrastructure/http/app';
import { MongoConnectionManager } from '../src/infrastructure/drivers/MongoConnectionManager';
import { MongoRepository } from '../src/infrastructure/repositories/MongoRepository';

// In Jest, variables used in jest.mock must be prefixed with 'mock'
const mockManagerInstance = {
    connect: jest.fn().mockResolvedValue({}),
    listDatabases: jest.fn().mockResolvedValue(['admin', 'local', 'testDb']),
    disconnectAll: jest.fn().mockResolvedValue(undefined),
    getDb: jest.fn().mockReturnValue({}),
};

// Global mock of the singleton
jest.mock('../src/infrastructure/drivers/MongoConnectionManager', () => {
    return {
        MongoConnectionManager: {
            getInstance: jest.fn(() => ({
                connect: jest.fn().mockResolvedValue({}),
                listDatabases: jest.fn().mockResolvedValue(['admin', 'local', 'testDb']),
                disconnectAll: jest.fn().mockResolvedValue(undefined),
                getDb: jest.fn().mockReturnValue({}),
            }))
        }
    };
});

// Mock Repository
jest.mock('../src/infrastructure/repositories/MongoRepository');

describe('API Integration Tests', () => {
    let server: FastifyInstance;

    beforeAll(async () => {
        server = await createServer({
            port: 15240,
            host: '0.0.0.0',
            reportedHost: 'localhost',
            mongodbUri: 'mongodb://localhost:27017',
            mongodbDatabase: 'test',
            rbacConfigPath: './src/shared/config/rbac.yaml',
            logLevel: 'error',
            nodeEnv: 'test'
        });
        await server.ready();
    });

    afterAll(async () => {
        await server.close();
    });

    test('GET /Health should return 200 and status Ok', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/Health'
        });

        expect(response.statusCode).toBe(200);
        const payload = JSON.parse(response.payload);
        expect(payload.status).toBe('Ok');
        expect(Array.isArray(payload.data.databases)).toBe(true);
    });

    test('GET /Documents should return document list', async () => {
        const mockDocs = [{ _id: '1', name: 'Test Doc' }];
        (MongoRepository.prototype.find as jest.Mock).mockResolvedValue(mockDocs);

        const response = await server.inject({
            method: 'GET',
            url: '/Documents',
            query: {
                database: 'test',
                collection: 'testCol'
            }
        });

        expect(response.statusCode).toBe(200);
        const payload = JSON.parse(response.payload);
        expect(Array.isArray(payload)).toBe(true);
        expect(payload[0].name).toBe('Test Doc');
    });

    test('PUT /Documents should create a document', async () => {
        const newDoc = { name: 'New Doc' };
        const mockResult = { acknowledged: true, insertedId: '1' };
        (MongoRepository.prototype.insertOne as jest.Mock).mockResolvedValue(mockResult);

        const response = await server.inject({
            method: 'PUT',
            url: '/Documents',
            query: {
                database: 'test',
                collection: 'testCol'
            },
            payload: newDoc
        });

        expect(response.statusCode).toBe(200);
        const payload = JSON.parse(response.payload);
        expect(payload.name).toBe('New Doc');
        expect(payload._id).toBe('1');
    });
});

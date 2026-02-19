import { MongoConnectionManager } from '../src/infrastructure/drivers/MongoConnectionManager';
import { MongoClient } from 'mongodb';

jest.mock('mongodb');

describe('MongoConnectionManager', () => {
    let manager: MongoConnectionManager;
    const uri = 'mongodb://localhost:27017';
    const dbName = 'testDb';

    beforeEach(() => {
        jest.clearAllMocks();
        manager = MongoConnectionManager.getInstance();
    });

    test('should be a singleton', () => {
        const instance1 = MongoConnectionManager.getInstance();
        const instance2 = MongoConnectionManager.getInstance();
        expect(instance1).toBe(instance2);
    });

    test('should connect and cache the database', async () => {
        const mockDb = { name: 'mocked' };
        const mockClient = {
            connect: jest.fn().mockResolvedValue(undefined),
            db: jest.fn().mockReturnValue(mockDb),
            close: jest.fn().mockResolvedValue(undefined)
        };

        (MongoClient as unknown as jest.Mock).mockImplementation(() => mockClient);

        const db = await manager.connect(uri, dbName);

        expect(db).toBe(mockDb);
        expect(mockClient.connect).toHaveBeenCalledTimes(1);
        expect(mockClient.db).toHaveBeenCalledWith(dbName);

        // Second call should return cached DB
        const db2 = await manager.connect(uri, dbName);
        expect(db2).toBe(mockDb);
        expect(mockClient.connect).toHaveBeenCalledTimes(1); // Still 1
    });

    test('should throw error if getDb is called before connect', () => {
        // We need to clear internal state for a fresh test if possible
        // but since it's a singleton we'll use a unique key
        const freshUri = 'mongodb://other:27017';
        expect(() => manager.getDb(freshUri, 'otherDb')).toThrow(/not connected/);
    });
});

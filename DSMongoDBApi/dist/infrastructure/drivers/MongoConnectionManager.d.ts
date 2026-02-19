import { Db, MongoClientOptions } from 'mongodb';
/**
 * Singleton manager for MongoDB connections.
 * Maintains a pool of connections keyed by connection string and database name.
 */
export declare class MongoConnectionManager {
    private static instance;
    private clients;
    private dbs;
    private constructor();
    static getInstance(): MongoConnectionManager;
    /**
     * Connect to a MongoDB database using a connection string and database name.
     * Returns a cached Db instance if already connected.
     */
    connect(uri: string, dbName: string, options?: MongoClientOptions): Promise<Db>;
    /**
     * Disconnect from a specific URI (closes the client and removes all related dbs).
     */
    disconnect(uri: string): Promise<void>;
    /**
     * Disconnect from all clients (cleanup on application shutdown).
     */
    disconnectAll(): Promise<void>;
    /**
     * Get a Db instance if already connected, otherwise throws.
     */
    getDb(uri: string, dbName: string): Db;
}
//# sourceMappingURL=MongoConnectionManager.d.ts.map
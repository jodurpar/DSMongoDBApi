import { MongoClient, Db, MongoClientOptions } from 'mongodb';

/**
 * Singleton manager for MongoDB connections.
 * Maintains a pool of connections keyed by connection string and database name.
 */
export class MongoConnectionManager {
    private static instance: MongoConnectionManager;
    private clients: Map<string, MongoClient> = new Map();
    private dbs: Map<string, Db> = new Map();

    private constructor() { }

    static getInstance(): MongoConnectionManager {
        if (!MongoConnectionManager.instance) {
            MongoConnectionManager.instance = new MongoConnectionManager();
        }
        return MongoConnectionManager.instance;
    }

    /**
     * Connect to a MongoDB database using a connection string and database name.
     * Returns a cached Db instance if already connected.
     */
    async connect(uri: string, dbName: string, options?: MongoClientOptions): Promise<Db> {
        const key = `${uri}|${dbName}`;
        if (this.dbs.has(key)) {
            return this.dbs.get(key)!;
        }

        let client = this.clients.get(uri);
        if (!client) {
            client = new MongoClient(uri, {
                ...options,
                maxPoolSize: 10,
                minPoolSize: 1,
            });
            await client.connect();
            this.clients.set(uri, client);
        }

        const db = client.db(dbName);
        this.dbs.set(key, db);
        return db;
    }

    /**
     * Disconnect from a specific URI (closes the client and removes all related dbs).
     */
    async disconnect(uri: string): Promise<void> {
        const client = this.clients.get(uri);
        if (client) {
            await client.close();
            this.clients.delete(uri);
            // Remove all dbs that used this URI
            for (const [key, _] of this.dbs.entries()) {
                if (key.startsWith(uri + '|')) {
                    this.dbs.delete(key);
                }
            }
        }
    }

    /**
     * Disconnect from all clients (cleanup on application shutdown).
     */
    async disconnectAll(): Promise<void> {
        for (const client of this.clients.values()) {
            await client.close();
        }
        this.clients.clear();
        this.dbs.clear();
    }

    /**
     * Get a Db instance if already connected, otherwise throws.
     */
    getDb(uri: string, dbName: string): Db {
        const key = `${uri}|${dbName}`;
        const db = this.dbs.get(key);
        if (!db) {
            throw new Error(`Database ${dbName} not connected. Call connect() first.`);
        }
        return db;
    }
}
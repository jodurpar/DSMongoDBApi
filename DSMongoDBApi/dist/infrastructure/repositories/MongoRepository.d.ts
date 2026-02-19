import { Document } from 'mongodb';
import { IRepository, FindOptions, FindOneOptions, UpdateOptions, InsertOneResult, InsertManyResult, UpdateResult, DeleteResult } from '../../domain/ports/IRepository';
/**
 * Generic MongoDB repository implementation.
 * @typeparam T - The entity type (must have an optional _id field of type ObjectId or string).
 */
export declare class MongoRepository<T extends Document> implements IRepository<T> {
    private readonly uri;
    private readonly databaseName;
    private readonly collectionName;
    private db?;
    private collection?;
    constructor(uri: string, databaseName: string, collectionName: string);
    /**
     * Ensure the repository is connected (call this before any operation if not already connected).
     */
    connect(): Promise<void>;
    /**
     * Internal helper to ensure the collection is ready.
     */
    private ensureCollection;
    find(filter: Record<string, any>, options?: FindOptions): Promise<T[]>;
    findOne(filter: Record<string, any>, options?: FindOneOptions): Promise<T | null>;
    insertOne(document: Omit<T, '_id'>): Promise<InsertOneResult>;
    insertMany(documents: Omit<T, '_id'>[]): Promise<InsertManyResult>;
    updateOne(filter: Record<string, any>, update: Record<string, any>, options?: UpdateOptions): Promise<UpdateResult>;
    updateMany(filter: Record<string, any>, update: Record<string, any>, options?: UpdateOptions): Promise<UpdateResult>;
    deleteOne(filter: Record<string, any>): Promise<DeleteResult>;
    deleteMany(filter: Record<string, any>): Promise<DeleteResult>;
    count(filter: Record<string, any>): Promise<number>;
    exists(filter: Record<string, any>): Promise<boolean>;
    /**
     * Normalize filter: convert string _id to ObjectId if needed.
     */
    private normalizeFilter;
}
//# sourceMappingURL=MongoRepository.d.ts.map
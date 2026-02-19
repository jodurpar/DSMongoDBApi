import { Db, Collection, ObjectId, Filter, UpdateFilter, Document } from 'mongodb';
import { MongoConnectionManager } from '../drivers/MongoConnectionManager';
import {
    IRepository,
    FindOptions,
    FindOneOptions,
    UpdateOptions,
    InsertOneResult,
    InsertManyResult,
    UpdateResult,
    DeleteResult,
} from '../../domain/ports/IRepository';

/**
 * Generic MongoDB repository implementation.
 * @typeparam T - The entity type (must have an optional _id field of type ObjectId or string).
 */
export class MongoRepository<T extends Document> implements IRepository<T> {
    private db: Db;
    private collection: Collection<T>;

    constructor(
        private readonly uri: string,
        private readonly databaseName: string,
        private readonly collectionName: string
    ) {
        const manager = MongoConnectionManager.getInstance();
        this.db = manager.getDb(uri, databaseName);
        this.collection = this.db.collection<T>(collectionName);
    }

    /**
     * Ensure the repository is connected (call this before any operation if not already connected).
     */
    async connect(): Promise<void> {
        const manager = MongoConnectionManager.getInstance();
        this.db = await manager.connect(this.uri, this.databaseName);
        this.collection = this.db.collection<T>(this.collectionName);
    }

    async find(filter: Record<string, any>, options?: FindOptions): Promise<T[]> {
        const cursor = this.collection.find(this.normalizeFilter(filter));
        if (options?.sort) {
            cursor.sort(options.sort);
        }
        if (options?.skip) {
            cursor.skip(options.skip);
        }
        if (options?.limit) {
            cursor.limit(options.limit);
        }
        if (options?.projection) {
            cursor.project(options.projection);
        }
        return cursor.toArray() as Promise<T[]>;
    }

    async findOne(filter: Record<string, any>, options?: FindOneOptions): Promise<T | null> {
        const cursor = this.collection.find(this.normalizeFilter(filter));
        if (options?.sort) {
            cursor.sort(options.sort);
        }
        if (options?.projection) {
            cursor.project(options.projection);
        }
        return (await cursor.limit(1).next()) as T | null;
    }

    async insertOne(document: Omit<T, '_id'>): Promise<InsertOneResult> {
        const result = await this.collection.insertOne(document as any);
        return {
            acknowledged: result.acknowledged,
            insertedId: result.insertedId,
        };
    }

    async insertMany(documents: Omit<T, '_id'>[]): Promise<InsertManyResult> {
        const result = await this.collection.insertMany(documents as any[]);
        return {
            acknowledged: result.acknowledged,
            insertedIds: Object.values(result.insertedIds),
        };
    }

    async updateOne(
        filter: Record<string, any>,
        update: Record<string, any>,
        options?: UpdateOptions
    ): Promise<UpdateResult> {
        const updateFilter: UpdateFilter<T> = { $set: update as any };
        const result = await this.collection.updateOne(this.normalizeFilter(filter), updateFilter, {
            upsert: options?.upsert ?? false,
        });
        return {
            acknowledged: result.acknowledged,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            upsertedCount: result.upsertedCount ?? 0,
            upsertedId: result.upsertedId ?? null,
        };
    }

    async updateMany(
        filter: Record<string, any>,
        update: Record<string, any>,
        options?: UpdateOptions
    ): Promise<UpdateResult> {
        const updateFilter: UpdateFilter<T> = { $set: update as any };
        const result = await this.collection.updateMany(this.normalizeFilter(filter), updateFilter, {
            upsert: options?.upsert ?? false,
        });
        return {
            acknowledged: result.acknowledged,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            upsertedCount: result.upsertedCount ?? 0,
            upsertedId: result.upsertedId ?? null,
        };
    }

    async deleteOne(filter: Record<string, any>): Promise<DeleteResult> {
        const result = await this.collection.deleteOne(this.normalizeFilter(filter));
        return {
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        };
    }

    async deleteMany(filter: Record<string, any>): Promise<DeleteResult> {
        const result = await this.collection.deleteMany(this.normalizeFilter(filter));
        return {
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        };
    }

    async count(filter: Record<string, any>): Promise<number> {
        return this.collection.countDocuments(this.normalizeFilter(filter));
    }

    async exists(filter: Record<string, any>): Promise<boolean> {
        const count = await this.collection.countDocuments(this.normalizeFilter(filter), { limit: 1 });
        return count > 0;
    }

    /**
     * Normalize filter: convert string _id to ObjectId if needed.
     */
    private normalizeFilter(filter: Record<string, any>): Filter<T> {
        const normalized = { ...filter };
        if (normalized._id && typeof normalized._id === 'string') {
            try {
                normalized._id = new ObjectId(normalized._id);
            } catch (e) {
                // If it's not a valid ObjectId, keep as string (maybe it's a custom ID)
            }
        }
        return normalized as Filter<T>;
    }
}
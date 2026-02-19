/**
 * Generic repository interface for data access operations.
 * Follows the Ports & Adapters pattern to allow swapping implementations.
 */
export interface IRepository<T> {
    /**
     * Find documents matching the filter.
     * @param filter - MongoDB filter object
     * @param options - Options for sorting, projection, pagination
     */
    find(filter: Record<string, any>, options?: FindOptions): Promise<T[]>;
    /**
     * Find a single document matching the filter.
     */
    findOne(filter: Record<string, any>, options?: FindOneOptions): Promise<T | null>;
    /**
     * Insert a single document.
     */
    insertOne(document: Omit<T, '_id'>): Promise<InsertOneResult>;
    /**
     * Insert multiple documents.
     */
    insertMany(documents: Omit<T, '_id'>[]): Promise<InsertManyResult>;
    /**
     * Update a single document matching the filter.
     */
    updateOne(filter: Record<string, any>, update: Record<string, any>, options?: UpdateOptions): Promise<UpdateResult>;
    /**
     * Update multiple documents matching the filter.
     */
    updateMany(filter: Record<string, any>, update: Record<string, any>, options?: UpdateOptions): Promise<UpdateResult>;
    /**
     * Delete a single document matching the filter.
     */
    deleteOne(filter: Record<string, any>): Promise<DeleteResult>;
    /**
     * Delete multiple documents matching the filter.
     */
    deleteMany(filter: Record<string, any>): Promise<DeleteResult>;
    /**
     * Count documents matching the filter.
     */
    count(filter: Record<string, any>): Promise<number>;
    /**
     * Check if a document exists matching the filter.
     */
    exists(filter: Record<string, any>): Promise<boolean>;
}
export interface FindOptions {
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
    projection?: Record<string, 0 | 1>;
}
export interface FindOneOptions {
    sort?: Record<string, 1 | -1>;
    projection?: Record<string, 0 | 1>;
}
export interface UpdateOptions {
    upsert?: boolean;
}
export interface InsertOneResult {
    acknowledged: boolean;
    insertedId: any;
}
export interface InsertManyResult {
    acknowledged: boolean;
    insertedIds: any[];
}
export interface UpdateResult {
    acknowledged: boolean;
    matchedCount: number;
    modifiedCount: number;
    upsertedCount: number;
    upsertedId: any | null;
}
export interface DeleteResult {
    acknowledged: boolean;
    deletedCount: number;
}
//# sourceMappingURL=IRepository.d.ts.map
/**
 * MongoDb utility module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
import { IMongoDb } from '../interface/IMongoDb';
import { Connection } from '../../api/models/Connection';
declare class MongoDb implements IMongoDb {
    databases: any[];
    constructor();
    ObjectId(value: string): any;
    private getDb;
    private getDbAsync;
    closeMongo(): void;
    closeMongoAsync(): Promise<any>;
    dropCollection(connectionName: string, collectionName: string): Promise<any>;
    addConnection(data: Connection, onComplete: any, onError: any): unknown;
    addConnectionAsync(data: Connection, onComplete: any, onError: any): Promise<object>;
    addConnections(data: Array<Connection>, onComplete: any, onError: any): unknown;
    addConnectionsAsync(data: Array<Connection>, onComplete: any, onError: any): Promise<object>;
    readDocuments(connectionName: string, collection: string, filter: object, selectedFields: object, onComplete: any, onError: any): void;
    readDocumentsAsync(connectionName: string, collection: string, filter: object, selectedFields: object): Promise<any>;
    addDocuments(connectionName: string, collection: string, data: object, onComplete: any, onError: any): void;
    addDocumentsAsync(connectionName: string, collection: string, data: object): Promise<any>;
    deleteDocuments(connectionName: string, collection: string, filter: object, onComplete: any, onError: any): void;
    deleteDocumentsAsync(connectionName: string, collection: string, filter: object): Promise<any>;
    updateDocument(connectionName: string, collection: string, filter: object, data: object, onComplete: any, onError: any): void;
    updateDocumentAsync(connectionName: string, collection: string, filter: object, data: object): Promise<any>;
    updateDocuments(connectionName: string, collection: string, filter: object, data: object, onComplete: any, onError: any): void;
    updateDocumentsAsync(connectionName: string, collection: string, filter: object, data: object): Promise<any>;
}
declare const _default: MongoDb;
export = _default;
//# sourceMappingURL=MongoDb.d.ts.map
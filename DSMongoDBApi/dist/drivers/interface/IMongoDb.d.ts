/**
 * MongoDB interface module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
export interface IMongoDb {
    closeMongo(): any;
    closeMongoAsync(): any;
    addConnection(data: object, onComplete: any, onError: any): any;
    addConnectionAsync(data: object, onComplete: any, onError: any): Promise<object>;
    dropCollection(connectionString: string, collectionName: string): Promise<any>;
    readDocuments(connectionString: string, collection: string, filter: object, selectedFields: object, oncomplete: any, onError: any): any;
    readDocumentsAsync(connectionString: string, collection: string, filter: object, selectedFields: object, onComplete: any, onError: any): Promise<object>;
    addDocuments(connectionString: string, collection: string, data: object[], onComplete: any, onError: any): any;
    addDocumentsAsync(connectionString: string, collection: string, data: object[], onComplete: any, onError: any): Promise<object>;
    deleteDocuments(connectionString: string, collection: string, filter: object, onComplete: any, onError: any): any;
    deleteDocumentsAsync(connectionString: string, collection: string, filter: object, onComplete: any, onError: any): Promise<object>;
    updateDocument(connectionString: string, collection: string, filter: object, data: object[], onComplete: any, onError: any): any;
    updateDocumentAsync(connectionString: string, collection: string, filter: object, data: object[], onComplete: any, onError: any): Promise<object>;
    updateDocuments(connectionString: string, collection: string, filter: object, data: object[], onComplete: any, onError: any): any;
    updateDocumentsAsync(connectionString: string, collection: string, filter: object, data: object[], onComplete: any, onError: any): Promise<object>;
}
//# sourceMappingURL=IMongoDb.d.ts.map
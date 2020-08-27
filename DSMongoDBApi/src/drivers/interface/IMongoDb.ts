
/**
 * MongoDB interface module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */

export interface IMongoDb {

    closeMongo();
    closeMongoAsync();

    addConnection(data: object, onComplete, onError);
    addConnectionAsync(data: object, onComplete, onError): Promise<object>;

    dropCollection(connectionString: string, collectionName: string) : Promise<any>;

    readDocuments(connectionString: string, collection: string, filter: object, selectedFields: object, oncomplete,  onError);
    readDocumentsAsync(connectionString: string, collection: string, filter: object, selectedFields:object, onComplete, onError) : Promise<object>;

    addDocuments(connectionString: string, collection: string, data: object[], onComplete, onError);
    addDocumentsAsync(connectionString: string, collection: string, data: object[], onComplete, onError) : Promise<object>;

    deleteDocuments(connectionString: string, collection: string, filter: object, onComplete, onError );
    deleteDocumentsAsync(connectionString: string, collection: string, filter: object, onComplete, onError) : Promise<object>;

    updateDocument(connectionString: string, collection: string, filter: object, data: object[], onComplete, onError) ;
    updateDocumentAsync(connectionString: string, collection: string, filter: object, data: object[], onComplete, onError): Promise<object>;

    updateDocuments(connectionString: string, collection: string, filter: object, data: object[], onComplete, onError);
    updateDocumentsAsync(connectionString: string, collection: string, filter: object, data: object[], onComplete, onError): Promise<object>;

}
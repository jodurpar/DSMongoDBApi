


    export interface IDocuments {
        PutDocuments(collection: string, data: any): object;
        PutDocumentsAsync(collection: string, data: any): Promise<object>;
    }


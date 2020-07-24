


    export interface IDocuments {
        PatchDocuments(collection: string, data: any): object;
        PatchDocumentsAsync(collection: string, data: any): Promise<object>;
    }


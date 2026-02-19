import { restify } from 'restify';
export interface IDocuments {
    DeleteDocuments(req: restify.request, res: restify.response): any;
    DeleteDocumentsAsync(req: restify.request, res: restify.response): Promise<object>;
}
//# sourceMappingURL=IDocuments.d.ts.map
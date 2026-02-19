import { restify } from 'restify';
export interface IDocuments {
    GetDocuments(req: restify.request, res: restify.response): any;
    GetDocumentsAsync(req: restify.request, res: restify.response): Promise<object>;
}
//# sourceMappingURL=IDocuments.d.ts.map
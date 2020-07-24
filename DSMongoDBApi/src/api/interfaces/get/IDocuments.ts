


import { restify } from 'restify';

export interface IDocuments {
        GetDocuments(req: restify.request, res: restify.response);
        GetDocumentsAsync(req: restify.request, res: restify.response): Promise<object>;
    }


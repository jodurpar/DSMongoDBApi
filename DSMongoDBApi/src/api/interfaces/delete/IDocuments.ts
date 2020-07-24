
import { restify } from 'restify';

    export interface IDocuments {
        DeleteDocuments(req: restify.request, res: restify.response);
        DeleteDocumentsAsync(req: restify.request, res: restify.response): Promise<object>;
    }





import { restify } from 'restify';

export interface ICollections {
    dropCollection(req: restify.request, res: restify.response);
    dropCollectionAsync(req: restify.request, res: restify.response): Promise<object>;
}
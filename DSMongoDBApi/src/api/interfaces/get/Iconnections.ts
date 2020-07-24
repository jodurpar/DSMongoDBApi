


import { restify } from 'restify';

export interface IConnections {
    addConnection(req: restify.request, res: restify.response);
    addConnectionAsync(req: restify.request, res: restify.response): Promise<object>;
}
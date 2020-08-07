


import { restify } from 'restify';

export interface IConnections {
    addConnections(req: restify.request, res: restify.response);
    addConnectionsAsync(req: restify.request, res: restify.response): Promise<object>;
}
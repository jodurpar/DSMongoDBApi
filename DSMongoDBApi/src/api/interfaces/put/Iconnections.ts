


import { restify } from 'restify';

export interface IConnections {
    addConnections(req: restify.request, res: restify.response);
}



import { restify } from 'restify';

export interface IConnection {
    addConnection(req: restify.request, res: restify.response);
}
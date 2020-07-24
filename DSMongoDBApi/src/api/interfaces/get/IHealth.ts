


import { restify } from 'restify';

export interface IHealth {
    Health(req: restify.request, res: restify.response);
    HealthAsync(req: restify.request, res: restify.response): Promise<object>;
}



import { restify } from 'restify';

export interface IMessages {
    Test(req: restify.request, res: restify.response);
    TestAsync(req: restify.request, res: restify.response): Promise<object>;
}



import { restify } from 'restify';

export interface IMessages {
    TestMessages(req: restify.request, res: restify.response);
    TestMessagesAsync(req: restify.request, res: restify.response): Promise<object>;
}
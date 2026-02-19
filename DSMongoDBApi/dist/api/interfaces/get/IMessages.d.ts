import { restify } from 'restify';
export interface IMessages {
    Test(req: restify.request, res: restify.response): any;
    TestAsync(req: restify.request, res: restify.response): Promise<object>;
}
//# sourceMappingURL=IMessages.d.ts.map
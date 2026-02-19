import { restify } from 'restify';
export interface IHealth {
    Health(req: restify.request, res: restify.response): any;
    HealthAsync(req: restify.request, res: restify.response): Promise<object>;
}
//# sourceMappingURL=IHealth.d.ts.map
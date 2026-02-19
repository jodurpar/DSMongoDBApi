/**
 * elastic module
 * Version 1.0.0
 * 15.09.2020 - @JoseDuranPareja
 * */
import { restify } from 'restify';
import { version } from '../../../../utilities/Utility';
export declare namespace api100 {
    class Elastic extends version {
        Down(req: restify.request, res: restify.response): void;
        Up(req: restify.request, res: restify.response): void;
    }
}
//# sourceMappingURL=Elastic.d.ts.map
/**
 * Health module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
import { restify } from 'restify';
import { version } from '../../../utilities/Utility';
import { IHealth } from '../../interfaces/get/IHealth';
export declare namespace api100 {
    class Health extends version implements IHealth {
        Health(req: restify.request, res: restify.response): Promise<void>;
        HealthAsync(req: restify.request, res: restify.response): Promise<object>;
        private checkConnection;
        private Check;
    }
}
//# sourceMappingURL=Health.d.ts.map
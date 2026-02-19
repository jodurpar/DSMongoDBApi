/**
 * Add simple connection module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
import { restify } from 'restify';
import { version } from '../../../../utilities/Utility';
import { IConnection } from '../../../interfaces/put/Iconnection';
export declare namespace api100 {
    class connection extends version implements IConnection {
        addConnection(req: restify.request, res: restify.response): void;
    }
}
//# sourceMappingURL=connection.d.ts.map
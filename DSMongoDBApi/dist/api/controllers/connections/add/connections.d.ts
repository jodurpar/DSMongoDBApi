/**
 * Add multiple Connections module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
import { restify } from 'restify';
import { version } from '../../../../utilities/Utility';
import { IConnections } from '../../../interfaces/put/Iconnections';
export declare namespace api100 {
    class connections extends version implements IConnections {
        addConnections(req: restify.request, res: restify.response): void;
    }
}
//# sourceMappingURL=connections.d.ts.map
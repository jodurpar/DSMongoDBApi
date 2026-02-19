/**
 * Drop collectios module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
import { restify } from 'restify';
import { version } from '../../../../utilities/Utility';
import { ICollections } from '../../../interfaces/get/ICollections';
export declare namespace api100 {
    class collections extends version implements ICollections {
        dropCollection(req: restify.request, res: restify.response): Promise<void>;
        dropCollectionAsync(req: restify.request, res: restify.response): Promise<object>;
    }
}
//# sourceMappingURL=collections.d.ts.map
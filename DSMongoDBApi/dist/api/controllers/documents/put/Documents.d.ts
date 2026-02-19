import { restify } from 'restify';
import { version } from '../../../../utilities/Utility';
import { IDocuments } from '../../../interfaces/put/IDocuments';
export declare namespace api100 {
    class Documents extends version implements IDocuments {
        PutDocuments(req: restify.request, res: restify.response): Promise<void>;
        PutDocumentsAsync(req: restify.request, res: restify.response): Promise<object>;
    }
}
//# sourceMappingURL=Documents.d.ts.map
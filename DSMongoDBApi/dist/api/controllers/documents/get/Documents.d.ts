import { restify } from 'restify';
import { version } from '../../../../utilities/Utility';
import { IDocuments } from '../../../interfaces/get/IDocuments';
export declare namespace api100 {
    class Documents extends version implements IDocuments {
        GetDocuments(req: restify.request, res: restify.response): void;
        GetDocumentsAsync(req: restify.request, res: restify.response): Promise<object>;
    }
}
//# sourceMappingURL=Documents.d.ts.map
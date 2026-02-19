import { restify } from 'restify';
import { version } from '../../../../utilities/Utility';
import { IDocuments } from '../../../interfaces/patch/IDocuments';
export declare namespace api100 {
    class Documents extends version implements IDocuments {
        PatchDocuments(req: restify.request, res: restify.response): Promise<void>;
        PatchDocumentsAsync(req: restify.request, res: restify.response): Promise<object>;
    }
}
//# sourceMappingURL=Documents.d.ts.map
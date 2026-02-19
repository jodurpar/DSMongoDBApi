import { restify } from 'restify';
import { version } from '../../../../utilities/Utility';
import { IDocuments } from '../../../interfaces/delete/IDocuments';
export declare namespace api100 {
    class Documents extends version implements IDocuments {
        DeleteDocuments(req: restify.request, res: restify.response): void;
        DeleteDocumentsAsync(req: restify.request, res: restify.response): Promise<any>;
    }
}
//# sourceMappingURL=Documents.d.ts.map
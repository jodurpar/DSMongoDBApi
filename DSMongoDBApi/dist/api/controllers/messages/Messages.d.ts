import { restify } from 'restify';
import { version } from '../../../utilities/Utility';
import { IMessages } from '../../interfaces/get/IMessages';
export declare namespace api100 {
    class Messages extends version implements IMessages {
        Test(req: restify.request, res: restify.response): void;
        TestAsync(req: restify.request, res: restify.response): Promise<object>;
    }
}
//# sourceMappingURL=Messages.d.ts.map
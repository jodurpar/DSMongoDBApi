
/**
 * log level module
 * Version 1.0.0
 * 15.09.2020 - @JoseDuranPareja
 * */

import { restify } from 'restify';

import { version, Messages, method } from '../../../../utilities/Utility'

import { Authorization, getMethodName } from '../../../decorators/decorators';
import { Log } from '../../../../../app';

export namespace api100 {

    @Authorization
    export class Level extends version {

        @getMethodName
        public Set(req: restify.request, res: restify.response) {
            try {
                Log.level(req.params.level);
                res.send(HTTPStatusCodes.OK,
                    Messages.sendObjectMessage(HTTPStatusCodes.OK, CommonConstants.SUCCESSFULLY, `Log level set to: ${req.params.level}`)
                );
            }
            catch (e) {
                res.send(HTTPStatusCodes.NOT_MODIFIED,
                    Messages.sendObjectMessage(HTTPStatusCodes.EXPECTATION_FAILED, CommonConstants.ERROR, `Log level unchanged because: ${e}`)
                );
            }
        }
    }
}

/**
 * elastic module
 * Version 1.0.0
 * 15.09.2020 - @JoseDuranPareja
 * */

import { restify } from 'restify';

import { version, Messages, method } from '../../../../utilities/Utility'

import { Authorization, getMethodName } from '../../../decorators/decorators';
import { Log } from '../../../../../app';

export namespace api100 {

    @Authorization
    export class Elastic extends version {

        @getMethodName
        public Down(req: restify.request, res: restify.response) {
            try {
                Log.elasticDown();
                res.send(HTTPStatusCodes.OK,
                    Messages.sendObjectMessage(HTTPStatusCodes.OK, CommonConstants.SUCCESSFULLY, 'Elastic is down')
                );
            }
            catch (e) {
                res.send(HTTPStatusCodes.NOT_MODIFIED,
                    Messages.sendObjectMessage(HTTPStatusCodes.EXPECTATION_FAILED, CommonConstants.ERROR, `Elastic log unchanged because: ${e}`)
                );
            }
        }
        @getMethodName
        public Up(req: restify.request, res: restify.response) {
            try {
                Log.elasticUp()
                res.send(HTTPStatusCodes.OK,
                    Messages.sendObjectMessage(HTTPStatusCodes.OK, CommonConstants.SUCCESSFULLY, 'Elastic is up')
                );
            }
            catch (e) {
                res.send(HTTPStatusCodes.NOT_MODIFIED,
                    Messages.sendObjectMessage(HTTPStatusCodes.EXPECTATION_FAILED, CommonConstants.ERROR, `Elastic log unchanged because: ${e}`)
                );
            }
        }
    }
}
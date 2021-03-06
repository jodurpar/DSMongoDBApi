﻿
/**
 * statistics module
 * Version 1.0.0
 * 28.09.2020 - @JoseDuranPareja
 * */

import { restify } from 'restify';

import { version, Messages, method } from '../../../../utilities/Utility'

import { Authorization, getMethodName } from '../../../decorators/decorators';
import { Log } from '../../../../../app';

export namespace api100 {

    @Authorization
    export class Statistics extends version {

 
        @getMethodName
        public Up(req: restify.request, res: restify.response) {
            try {
                Log.statisticsUp()
                res.send(HTTPStatusCodes.OK,
                    Messages.sendObjectMessage(HTTPStatusCodes.OK, CommonConstants.SUCCESSFULLY, 'Statistics is up')
                );
            }
            catch (e) {
                res.send(HTTPStatusCodes.NOT_MODIFIED,
                    Messages.sendObjectMessage(HTTPStatusCodes.EXPECTATION_FAILED, CommonConstants.ERROR, `Statistics log unchanged because: ${e}`)
                );
            }
        }
    }
}
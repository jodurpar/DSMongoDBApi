import { restify } from 'restify';

import { Utility } from '../../../utilities/Utility'
import { IMessages } from '../../interfaces/get/IMessages';

import { Authorization, getMethodName } from '../../decorators/decorators'

export namespace api100 {

    @Authorization
    export class Messages extends Utility.version implements IMessages {

        @getMethodName
        public TestMessages(req: restify.request, res: restify.response) {
            let _message = req.params.message != undefined ? req.params.message : req.body.message;
            res.send(HTTPStatusCodes.OK,
                Utility.Messages.sendObjectMessage(HTTPStatusCodes.OK,
                    CommonConstants.OK,
                    Utility.stringsUtility.format('{0}{1} {2} {3}{4} {5}',
                        Utility.method.getMethodName(this),
                        CommonConstants.TWOPOINTS,
                        this.Version,
                        CommonConstants.RECIEVED,
                        CommonConstants.TWOPOINTS,
                        _message)
                )
            );
        }

        @getMethodName
        public TestMessagesAsync(req: restify.request, res: restify.response): Promise<object> {
            let _self = this;
            let _message = req.params.message != undefined ? req.params.message : req.body.message;
            return new Promise<object>(async (resolve, reject) => {
                try {
                    res.send(HTTPStatusCodes.OK,
                        Utility.Messages.sendObjectMessage(HTTPStatusCodes.OK,
                            CommonConstants.OK,
                            Utility.stringsUtility.format('{0}{1} {2} {3}{4} {5}',
                                Utility.method.getMethodName(_self),
                                CommonConstants.TWOPOINTS,
                                this.Version,
                                CommonConstants.RECIEVED,
                                CommonConstants.TWOPOINTS,
                                _message)
                        )
                    );
                    resolve(await Utility.Messages.sendObjectMessageAsync(HTTPStatusCodes.OK,
                        CommonConstants.OK,
                        Utility.stringsUtility.format('{0} {1} {2}{3} {4}',
                            Utility.method.getMethodName(_self),
                            this.Version,
                            CommonConstants.RECIEVED,
                            CommonConstants.TWOPOINTS,
                            _message)
                        )
                    );
                }
                catch (error) {
                    reject(await Utility.Messages.sendObjectMessageAsync(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        error,
                        Utility.method.getMethodName(_self) + ' ' + this.Version)
                    );
                }
            });
        }
    }
}
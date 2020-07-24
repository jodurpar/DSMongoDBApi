import { restify } from 'restify';

import { Utility } from '../../../../utilities/Utility'
import { IConnections } from '../../../interfaces/get/IConnections';

import MongoDb = require('../../../../drivers/controller/MongoDb');
import { Authorization, getMethodName } from '../../../decorators/decorators'

export namespace api100 {

    @Authorization
    export class connections extends Utility.version implements IConnections {

        @getMethodName
        public async addConnection(req: restify.request, res: restify.response) {
            let _self = this;
            try {

                await MongoDb.addConnection(JSON.parse(req.params.connection), function (err, doc) {
                    res.send(HTTPStatusCodes.OK,
                        Utility.Messages.sendObjectMessage(HTTPStatusCodes.OK,
                            'Connection set to:' + req.params.connection,
                            Utility.method.getMethodName(_self)));
                }
                    , function (e, doc) {
                        res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                            Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                                e.message, Utility.method.getMethodName(_self)));
                    }
                );
            }
            catch (e) {
                res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                    Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        e.message, Utility.stringsUtility.format('{0} {1} {2}',
                            Utility.method.getMethodName(_self),
                            CommonConstants.TWOPOINTS,
                            req.params.connection)));
            }
        }

        @getMethodName
        public async addConnectionAsync(req: restify.request, res: restify.response): Promise<object> {
            let _self = this;
            return new Promise<object>(async (resolve, reject) => {
                try {

                    await MongoDb.addConnectionAsync(JSON.parse(req.params.connection), async function (err, doc) {
                        resolve(await res.send(HTTPStatusCodes.OK,
                            Utility.Messages.sendObjectMessage(HTTPStatusCodes.OK,
                                err,
                                doc)));
                    }, async function (e, doc) {
                        reject(res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                            await Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                                e.message,
                                Utility.method.getMethodName(_self))))
                    }
                    );
                }
                catch (e) {
                    reject(res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                            e.message,
                            Utility.stringsUtility.format('{0} {1} {2}',
                                Utility.method.getMethodName(_self),
                                CommonConstants.TWOPOINTS,
                                req.params.connection)
                        )
                    ));
                }
            });
        }
    }
}
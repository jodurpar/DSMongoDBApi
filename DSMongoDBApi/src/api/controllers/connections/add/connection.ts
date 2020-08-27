
/**
 * Add simple connection module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */

import { restify } from 'restify';

import { version, method, Messages, stringsUtility } from '../../../../utilities/Utility'
import { IConnections } from '../../../interfaces/put/Iconnections';

import MongoDb = require('../../../../drivers/controller/MongoDb');
import { Authorization, getMethodName } from '../../../decorators/decorators'
import Bunyan = require('../../../../utilities/Bunyan');
import { IConnection } from '../../../interfaces/put/Iconnection';

export namespace api100 {

    @Authorization
    export class connection extends version implements IConnection {

        @getMethodName
        public  addConnection(req: restify.request, res: restify.response) {
            let _self = this;
            try {
                 MongoDb.addConnection(JSON.parse(req.params.connection), function (err, doc) {
                    res.send(HTTPStatusCodes.OK,
                        Messages.sendObjectMessage(HTTPStatusCodes.OK,
                            'Connection set to:' + req.params.connection,
                            method.getMethodName(_self)));
                }
                    , function (e, doc) {
                        res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                            Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                                e.message, method.getMethodName(_self)));
                    }
                );
            }
            catch (e) {
            
                res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                    Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        e.message, stringsUtility.format('{0} {1} {2}',
                            method.getMethodName(_self),
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
                            Messages.sendObjectMessage(HTTPStatusCodes.OK,
                                err,
                                doc)));
                    }, async function (e, doc) {
                        reject(res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                            await Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                                e.message,
                                method.getMethodName(_self))))
                    }
                    );
                }
                catch (e) {
                    reject(res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                            e.message,
                            stringsUtility.format('{0} {1} {2}',
                                method.getMethodName(_self),
                                CommonConstants.TWOPOINTS,
                                req.params.connection)
                        )
                    ));
                }
            });
        }
    }
}
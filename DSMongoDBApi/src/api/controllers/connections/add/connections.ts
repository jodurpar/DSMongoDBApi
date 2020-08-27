/**
 * Add multiple Connections module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */

import { restify } from 'restify';

import { version, Messages, method, stringsUtility } from '../../../../utilities/Utility'
import { IConnections } from '../../../interfaces/put/Iconnections';

import MongoDb = require('../../../../drivers/controller/MongoDb');
import { Authorization, getMethodName } from '../../../decorators/decorators'
import Bunyan = require('../../../../utilities/Bunyan');

export namespace api100 {

    @Authorization
    export class connections extends version implements IConnections {

        @getMethodName
        public  addConnections(req: restify.request, res: restify.response) {
            let _self = this;
            try {
                 MongoDb.addConnections(JSON.parse(req.params.connections), function (err, doc) {
                    res.send(HTTPStatusCodes.OK,
                        Messages.sendObjectMessage(HTTPStatusCodes.OK,
                            'Connection set to:' + req.params.connections,
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
        public async addConnectionsAsync(req: restify.request, res: restify.response): Promise<object> {
            let _self = this;
            return new Promise<object>(async (resolve, reject) => {
                try {

                    await MongoDb.addConnectionsAsync(JSON.parse(req.params.connections), async function (err, doc) {
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
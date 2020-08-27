
/**
 * Drop collectios module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */

import { restify } from 'restify';

import { version, params, Messages, stringsUtility, method } from '../../../../utilities/Utility'
import { ICollections } from '../../../interfaces/get/ICollections';

import MongoDb = require('../../../../drivers/controller/MongoDb');
import { Authorization, getMethodName } from '../../../decorators/decorators'

export namespace api100 {

    @Authorization
    export class collections extends version implements ICollections {

        @getMethodName
        public async dropCollection(req: restify.request, res: restify.response) {
            let _self = this;
            let [database, collection] = params.assign(req);
            await MongoDb.dropCollection(database, collection)
                .then(value => {
                    if (value == true) {
                        res.send(HTTPStatusCodes.OK, Messages.sendObjectMessage(HTTPStatusCodes.OK, CommonConstants.OK, undefined));
                    }
                    else {
                        res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                            Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                                stringsUtility.format('{0}{1} {2} {3} {4}{5} {6} {7}',
                                    CommonConstants.COLLECTION,
                                    CommonConstants.TWOPOINTS,
                                    collection,
                                    CommonConstants.IN,
                                    CommonConstants.DATABASE,
                                    CommonConstants.TWOPOINTS,
                                    database,
                                    CommonConstants.CANTBEDELETED),
                                method.getMethodName(_self)
                            )
                        );
                    }
                })
                .catch(e => {
                    res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                            e.message,
                            method.getMethodName(_self)));
                })


        }

        @getMethodName
        public async dropCollectionAsync(req: restify.request, res: restify.response): Promise<object> {
            let _self = this;
            return new Promise<object>(async (resolve, reject) => {
                let [database, collection] = params.assign(req);
                await MongoDb.dropCollection(database, collection)
                    .then(async value => {
                        if (value == true) {
                            resolve(await Messages.sendObjectMessage(HTTPStatusCodes.OK, CommonConstants.OK, undefined));
                        }
                        else {
                            reject(await Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                                stringsUtility.format('{0}{1} {2} {3} {4}{5} {6} {7}',
                                    CommonConstants.COLLECTION,
                                    CommonConstants.TWOPOINTS,
                                    collection,
                                    CommonConstants.IN,
                                    CommonConstants.DATABASE,
                                    CommonConstants.TWOPOINTS,
                                    database,
                                    CommonConstants.CANTBEDELETED),
                                method.getMethodName(_self))
                            );
                        }
                    })
                    .catch(async e => {
                        reject(await Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                            e.message,
                            method.getMethodName(_self)));
                    })

            });
        }
    }
}
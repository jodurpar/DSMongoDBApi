﻿import { restify } from 'restify';

import { Utility } from '../../../../utilities/Utility'
import { IDocuments } from '../../../interfaces/get/IDocuments';

import MongoDb = require('../../../../drivers/controller/MongoDb');
import { Authorization, getMethodName } from '../../../decorators/decorators';

export namespace api100 {

    @Authorization
    export class Documents extends Utility.version implements IDocuments {


        @getMethodName
        public GetDocuments(req: restify.request, res: restify.response) {
            const _self = this;
            try {
				let selectedFields = req.params.selectedFields != undefined ? JSON.parse(req.params.selectedFields) : {}; 

				let filter = JSON.parse(req.params.filter);
				if (filter['_id'] !== undefined) {
					filter = { _id: MongoDb.ObjectId(filter['_id']) };
				}

                MongoDb.readDocuments(req.params.connection != undefined ? req.params.connection : req.params.database, req.params.collection, filter, selectedFields
					, function (err, doc) {
						if ( doc === undefined || doc === null || (doc.length !== undefined && doc.length < 1) ) {
							const error = Utility.status.getStatusFromMessage(CommonConstants.NOTFOUND);
							res.send(error, Utility.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, Utility.method.getMethodName(_self)));
						}
						else {
							res.send(HTTPStatusCodes.OK, doc);
						}
                    }
                    , function (e, doc) {
                        const error = Utility.status.getStatusFromMessage(e.message);
                        res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self)));
                    }
                );
            }
            catch (e) {
                const error = Utility.status.getStatusFromMessage(e.message);
                res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self)));
            }


        }

        @getMethodName
        public async GetDocumentsAsync(req: restify.request, res: restify.response) : Promise<object> {
            const _self = this;
            return new Promise<object>((resolve, reject) => {
                try {
					const selectedFields = req.params.selectedFields != undefined ? JSON.parse(req.params.selectedFields) : {}; 
					let filter = JSON.parse(req.params.filter);
					if (filter['_id'] !== undefined) {
						filter = { _id: MongoDb.ObjectId(filter['_id']) };
					}

                    MongoDb.readDocumentsAsync(req.params.connection != undefined ? req.params.connection : req.params.database, req.params.collection, filter,selectedFields)
                        .then(async result => {
							if (result === undefined || result === null || (result.length !== undefined && result.length < 1)) {
								const error = Utility.status.getStatusFromMessage(CommonConstants.NOTFOUND);
								resolve(await res.send(error, Utility.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, Utility.method.getMethodName(_self))));
							}
							else {
								resolve(await res.send(HTTPStatusCodes.OK, result));
							}
                        })
                        .catch(async e => {
                            const error = Utility.status.getStatusFromMessage(e.message);
                            resolve(await res.send(error, await Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self))))
                        })
                }
                catch (e) {
                    const error = Utility.status.getStatusFromMessage(e.message);
                    reject(res.send(error, Utility.Messages.sendObjectMessage(error,
                        e.message,
                        Utility.stringsUtility.format('{0}{1} {2}',
                            Utility.method.getMethodName(_self),
                            CommonConstants.TWOPOINTS,
                            req.params.filter))
                    ));
                }
            });
        }
    }
}


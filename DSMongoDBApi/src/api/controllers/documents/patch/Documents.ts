﻿import { restify } from 'restify';

import { version, params, status, Messages, method } from '../../../../utilities/Utility'
import { IDocuments } from '../../../interfaces/patch/IDocuments';

import MongoDb = require('../../../../drivers/controller/MongoDb');
import { Authorization, getMethodName } from '../../../decorators/decorators';

export namespace api100 {

    @Authorization
    export class Documents extends version implements IDocuments {

		@getMethodName
        public async PatchDocuments(req: restify.request, res: restify.response) {
            const _self = this;
            try {
				let [database, collection, filter, data, options] = params.assign(req);

				const updateData: any = { $set: data };
				if (filter['_id'] !== undefined) {
					filter = { _id: MongoDb.ObjectId(filter['_id']) };
				}
                if (options !== undefined && options[CommonConstants.MULTI] === CommonConstants.TRUE) {
                    await MongoDb.updateDocuments(database, collection, filter, updateData,
						function (err, doc) {
							if (doc === undefined || doc === null || doc.value === undefined || doc.value === null) {
								const error = status.getStatusFromMessage(CommonConstants.NOTFOUND);
								res.send(error, Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, method.getMethodName(_self)));
							}
							else {
								res.send(HTTPStatusCodes.OK, doc.value);
							}
                        }
                        , function (e) {
                            const error = status.getStatusFromMessage(e.message);
                            res.send(error, Messages.sendObjectMessage(error, e.message, method.getMethodName(_self)));
                        });
                }
                else {
                    await MongoDb.updateDocument(database, collection, filter, updateData,
						function (err, doc) {
							if (doc === undefined || doc === null || doc.value === undefined || doc.value === null) {
								const error = status.getStatusFromMessage(CommonConstants.NOTFOUND);
								res.send(error, Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, method.getMethodName(_self)));
							}
							else {
								res.send(HTTPStatusCodes.OK, doc.value);
							}
                        }
                        , function (e) {
                            const error = status.getStatusFromMessage(e.message);
                            res.send(error, Messages.sendObjectMessage(error, e.message, method.getMethodName(_self)));
                        });

                }
            }
            catch (e) {
                const error = status.getStatusFromMessage(e.message);
                res.send(error, Messages.sendObjectMessage(error, e.message, method.getMethodName(_self)));
            }
        }

		@getMethodName
        public async PatchDocumentsAsync(req: restify.request, res: restify.response) {
            const _self = this;
            return new Promise<object>(async (resolve, reject) => {
                try {
                    let [database, collection, filter, data, options] = params.assign(req);
					const updateData: any = { $set: data };
					if (filter['_id'] !== undefined) {
						filter = { _id: MongoDb.ObjectId(filter['_id']) };
					}
                    if (options !== undefined && options[CommonConstants.MULTI] === CommonConstants.TRUE) {
                        await MongoDb.updateDocumentsAsync(database, collection, filter, updateData)
							.then(async results => {
								if (results === undefined || results === null || results.value === undefined || results.value === null) {
									const error = status.getStatusFromMessage(CommonConstants.NOTFOUND);
									resolve(await res.send(error, Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, method.getMethodName(_self))));
								}
								else {
									resolve(await res.send(HTTPStatusCodes.OK, results.value));
								}
                            })
                            .catch(async e => {
                                const error = status.getStatusFromMessage(e);
                                resolve(await res.send(error, Messages.sendObjectMessage(error, e.message, method.getMethodName(_self))))
                            })
                    }
                    else {
                        await MongoDb.updateDocumentAsync(database, collection, filter, updateData)
							.then(async results => {
								if (results === undefined || results === null || results.value === undefined || results.value === null) {
									const error = status.getStatusFromMessage(CommonConstants.NOTFOUND);
									resolve(await res.send(error, Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, method.getMethodName(_self))));
								}
								else {
									resolve(await res.send(HTTPStatusCodes.OK, results.value));
								}
                            })
							.catch(async e => {
                                const error = status.getStatusFromMessage(e.message);
                                resolve(await res.send(error, Messages.sendObjectMessage(error, e.message, method.getMethodName(_self))))
                            })
                    }
                }
                catch (e) {
                    const error = status.getStatusFromMessage(e.message);
                    resolve(await res.send(error, Messages.sendObjectMessage(error, e.message, method.getMethodName(_self))));
                }
            });
        }
    }
}


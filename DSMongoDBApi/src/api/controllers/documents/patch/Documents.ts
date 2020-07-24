import { restify } from 'restify';

import { Utility } from '../../../../utilities/Utility'
import { IDocuments } from '../../../interfaces/patch/IDocuments';

import MongoDb = require('../../../../drivers/controller/MongoDb');
import { Authorization, getMethodName } from '../../../decorators/decorators';

export namespace api100 {

    @Authorization
    export class Documents extends Utility.version implements IDocuments {

		@getMethodName
        public async PatchDocuments(req: restify.request, res: restify.response) {
            const _self = this;
            try {
				let [database, collection, filter, data, options] = Utility.params.assign(req);

				const updateData: any = { $set: data };
				if (filter['_id'] !== undefined) {
					filter = { _id: MongoDb.ObjectId(filter['_id']) };
				}
                if (options !== undefined && options[CommonConstants.MULTI] === CommonConstants.TRUE) {
                    await MongoDb.updateDocuments(database, collection, filter, updateData,
						function (err, doc) {
							if (doc === undefined || doc === null || doc.value === undefined || doc.value === null) {
								const error = Utility.status.getStatusFromMessage(CommonConstants.NOTFOUND);
								res.send(error, Utility.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, Utility.method.getMethodName(_self)));
							}
							else {
								res.send(HTTPStatusCodes.OK, doc.value);
							}
                        }
                        , function (e) {
                            const error = Utility.status.getStatusFromMessage(e.message);
                            res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self)));
                        });
                }
                else {
                    await MongoDb.updateDocument(database, collection, filter, updateData,
						function (err, doc) {
							if (doc === undefined || doc === null || doc.value === undefined || doc.value === null) {
								const error = Utility.status.getStatusFromMessage(CommonConstants.NOTFOUND);
								res.send(error, Utility.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, Utility.method.getMethodName(_self)));
							}
							else {
								res.send(HTTPStatusCodes.OK, doc.value);
							}
                        }
                        , function (e) {
                            const error = Utility.status.getStatusFromMessage(e.message);
                            res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self)));
                        });

                }
            }
            catch (e) {
                const error = Utility.status.getStatusFromMessage(e.message);
                res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self)));
            }
        }

		@getMethodName
        public async PatchDocumentsAsync(req: restify.request, res: restify.response) {
            const _self = this;
            return new Promise<object>(async (resolve, reject) => {
                try {
                    let [database, collection, filter, data, options] = Utility.params.assign(req);
					const updateData: any = { $set: data };
					if (filter['_id'] !== undefined) {
						filter = { _id: MongoDb.ObjectId(filter['_id']) };
					}
                    if (options !== undefined && options[CommonConstants.MULTI] === CommonConstants.TRUE) {
                        await MongoDb.updateDocumentsAsync(database, collection, filter, updateData)
							.then(async results => {
								if (results === undefined || results === null || results.value === undefined || results.value === null) {
									const error = Utility.status.getStatusFromMessage(CommonConstants.NOTFOUND);
									resolve(await res.send(error, Utility.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, Utility.method.getMethodName(_self))));
								}
								else {
									resolve(await res.send(HTTPStatusCodes.OK, results.value));
								}
                            })
                            .catch(async e => {
                                const error = Utility.status.getStatusFromMessage(e);
                                resolve(await res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self))))
                            })
                    }
                    else {
                        await MongoDb.updateDocumentAsync(database, collection, filter, updateData)
							.then(async results => {
								if (results === undefined || results === null || results.value === undefined || results.value === null) {
									const error = Utility.status.getStatusFromMessage(CommonConstants.NOTFOUND);
									resolve(await res.send(error, Utility.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, Utility.method.getMethodName(_self))));
								}
								else {
									resolve(await res.send(HTTPStatusCodes.OK, results.value));
								}
                            })
							.catch(async e => {
                                const error = Utility.status.getStatusFromMessage(e.message);
                                resolve(await res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self))))
                            })
                    }
                }
                catch (e) {
                    const error = Utility.status.getStatusFromMessage(e.message);
                    resolve(await res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self))));
                }
            });
        }
    }
}


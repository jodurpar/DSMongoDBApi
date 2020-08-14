
import { restify } from 'restify';

import { version, params, status, Messages, method } from '../../../../utilities/Utility'
import { IDocuments } from '../../../interfaces/delete/IDocuments';

import MongoDb = require('../../../../drivers/controller/MongoDb');
import { Authorization, getMethodName } from '../../../decorators/decorators';



export namespace api100 {

    @Authorization
    export class Documents extends version implements IDocuments {

		@getMethodName
        public DeleteDocuments(req: restify.request, res: restify.response) {
            const _self = this;

            try {

				let [database, collection, filter] = params.assign(req);

				if (filter['_id'] !== undefined) {
					filter = { _id: MongoDb.ObjectId(filter['_id']) };
				}

                MongoDb.deleteDocuments(database, collection, filter
					, function (err, doc) {
						if (doc === undefined || doc === null || doc.n === undefined || doc.n === 0 ) {
							const error = status.getStatusFromMessage(CommonConstants.NOTFOUND);
							res.send(error, Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, method.getMethodName(_self)));
						}
						else {
							res.send(HTTPStatusCodes.OK, Messages.sendObjectMessage(HTTPStatusCodes.OK, err, doc));
						}
                    }
                    , function (e) {
                        res.send(status.getStatusFromMessage(e.message),
                            Messages.sendObjectMessage(status.getStatusFromMessage(e.message),
                                e.message,
                                method.getMethodName(_self)));
                    });
            }
            catch (e) {
                const error = status.getStatusFromMessage(e.message);
                res.send(error, Messages.sendObjectMessage(error, e.message, method.getMethodName(_self)));
            }
        }

		@getMethodName
        public async DeleteDocumentsAsync(req: restify.request, res: restify.response) {
            const _self = this;

            return new Promise<any>(async (resolve, reject) => {
                try {

                    let [database, collection, filter] = params.assign(req);
					if (filter['_id'] !== undefined) {
						filter = { _id: MongoDb.ObjectId(filter['_id']) };
					}

                    await MongoDb.deleteDocumentsAsync(database, collection, filter)
						.then(async results => {
							if (results === undefined || results === null ||  results.n === undefined || results.n === 0) {
								const error = status.getStatusFromMessage(CommonConstants.NOTFOUND);
								resolve(await res.send(error, Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, method.getMethodName(_self))));
							}
							else {
								resolve(await res.send(HTTPStatusCodes.OK, Messages.sendObjectMessage(HTTPStatusCodes.OK, CommonConstants.OK, results)));
							}
                        })
                        .catch(async e => {
                            const error = status.getStatusFromMessage(e.message);
                            reject(await res.send(error, Messages.sendObjectMessage(error, e.message, method.getMethodName(_self))))
                        })
                }
                catch (e) {
                    const error = status.getStatusFromMessage(e.message);
                    reject(await res.send(error, Messages.sendObjectMessage(error, e.message, method.getMethodName(_self))));
                }
            });
        }
    }
}


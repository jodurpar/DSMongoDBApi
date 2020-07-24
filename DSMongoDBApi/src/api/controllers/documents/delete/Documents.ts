
import { restify } from 'restify';

import { Utility } from '../../../../utilities/Utility'
import { IDocuments } from '../../../interfaces/delete/IDocuments';

import MongoDb = require('../../../../drivers/controller/MongoDb');
import { Authorization, getMethodName } from '../../../decorators/decorators';



export namespace api100 {

    @Authorization
    export class Documents extends Utility.version implements IDocuments {

		@getMethodName
        public DeleteDocuments(req: restify.request, res: restify.response) {
            const _self = this;

            try {

				let [database, collection, filter] = Utility.params.assign(req);

				if (filter['_id'] !== undefined) {
					filter = { _id: MongoDb.ObjectId(filter['_id']) };
				}

                MongoDb.deleteDocuments(database, collection, filter
					, function (err, doc) {
						if (doc === undefined || doc === null || doc.n === undefined || doc.n === 0 ) {
							const error = Utility.status.getStatusFromMessage(CommonConstants.NOTFOUND);
							res.send(error, Utility.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, Utility.method.getMethodName(_self)));
						}
						else {
							res.send(HTTPStatusCodes.OK, Utility.Messages.sendObjectMessage(HTTPStatusCodes.OK, err, doc));
						}
                    }
                    , function (e) {
                        res.send(Utility.status.getStatusFromMessage(e.message),
                            Utility.Messages.sendObjectMessage(Utility.status.getStatusFromMessage(e.message),
                                e.message,
                                Utility.method.getMethodName(_self)));
                    });
            }
            catch (e) {
                const error = Utility.status.getStatusFromMessage(e.message);
                res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self)));
            }
        }

		@getMethodName
        public async DeleteDocumentsAsync(req: restify.request, res: restify.response) {
            const _self = this;

            return new Promise<any>(async (resolve, reject) => {
                try {

                    let [database, collection, filter] = Utility.params.assign(req);
					if (filter['_id'] !== undefined) {
						filter = { _id: MongoDb.ObjectId(filter['_id']) };
					}

                    await MongoDb.deleteDocumentsAsync(database, collection, filter)
						.then(async results => {
							if (results === undefined || results === null ||  results.n === undefined || results.n === 0) {
								const error = Utility.status.getStatusFromMessage(CommonConstants.NOTFOUND);
								resolve(await res.send(error, Utility.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + CommonConstants.NOTFOUND, Utility.method.getMethodName(_self))));
							}
							else {
								resolve(await res.send(HTTPStatusCodes.OK, Utility.Messages.sendObjectMessage(HTTPStatusCodes.OK, CommonConstants.OK, results)));
							}
                        })
                        .catch(async e => {
                            const error = Utility.status.getStatusFromMessage(e.message);
                            reject(await res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self))))
                        })
                }
                catch (e) {
                    const error = Utility.status.getStatusFromMessage(e.message);
                    reject(await res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self))));
                }
            });
        }
    }
}


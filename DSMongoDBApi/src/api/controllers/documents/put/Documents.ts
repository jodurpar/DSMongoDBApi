﻿import { restify } from 'restify';

import { Utility } from '../../../../utilities/Utility'
import { IDocuments } from '../../../interfaces/put/IDocuments';

import MongoDb = require('../../../../drivers/controller/MongoDb');
import { Authorization, getMethodName } from '../../../decorators/decorators';

export namespace api100 {

	@Authorization
    export class Documents extends Utility.version implements IDocuments {

		@getMethodName
		public async PutDocuments(req: restify.request, res: restify.response) {
            const _self = this;
            const [database, collection, , data] = Utility.params.assign(req);

            try {
                await MongoDb.addDocuments(database, collection, data
					, function (err, doc) {
						res.send(HTTPStatusCodes.OK, doc.ops);
                    }
					, function (e) {
                        const error = Utility.status.getStatusFromMessage(e);
                        res.send(error, Utility.Messages.sendObjectMessage(error, e, Utility.method.getMethodName(_self)));
                    });
            }
            catch (e) {
                const error = Utility.status.getStatusFromMessage(e);
                res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self)));
            }
        }

		@getMethodName
        public async PutDocumentsAsync(req: restify.request, res: restify.response) {
            const _self = this;
            return new Promise<object>(async (resolve, reject) => {
                try {

					const [database, collection, , data] = Utility.params.assign(req);

                    await MongoDb.addDocumentsAsync(database, collection, data)
                        .then(async result => {
							resolve(await res.send(HTTPStatusCodes.OK, result.ops));
                        })
						.catch(async e => {
							const error = Utility.status.getStatusFromMessage(e.message);
                            resolve(await res.send(error, Utility.Messages.sendObjectMessage(error, e.message, Utility.method.getMethodName(_self))))
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


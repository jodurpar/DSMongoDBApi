
/**
 * Health module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */

import { restify } from 'restify';

import { version, Messages, method } from '../../../utilities/Utility'
import { IHealth } from '../../interfaces/get/IHealth';

const MongoClient = require('mongodb').MongoClient;

// import { MongoClient } from 'mongodb';

import { Authorization, getMethodName } from '../../decorators/decorators';
import { _apiData } from '../../../../app';

import { connections } from '../../../../app';

export namespace api100 {

    @Authorization
    export class Health extends version implements IHealth {

        @getMethodName
        public async Health(req: restify.request, res: restify.response) {
            await this.Check()
                .then(_message => {
                    if (_message.databases[0].error) {
                        res.send(HTTPStatusCodes.NOT_FOUND,
                            Messages.sendObjectMessage(HTTPStatusCodes.NOT_FOUND, CommonConstants.NODATAFORCONNECTION, _message)
                        );

                    }
                    else {
                        res.send(HTTPStatusCodes.OK,
                            Messages.sendObjectMessage(HTTPStatusCodes.OK, CommonConstants.OK, _message)
                        );
                    }
                })
                .catch(e => {
                    res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, e)
                    );
                })
        }

        @getMethodName
        public async HealthAsync(req: restify.request, res: restify.response): Promise<object> {
            let _self = this;
            return new Promise<object>(async (resolve, reject) => {
                try {
                    await this.Check()
                        .then(_message => {
                            if (_message.databases[0].error) {
                                Messages.sendObjectMessageAsync(HTTPStatusCodes.NOT_FOUND, CommonConstants.NODATAFORCONNECTION, _message)
                                    .then(result => {
                                        res.send(HTTPStatusCodes.NOT_FOUND, result);
                                        resolve(result);
                                    })
                                    .catch(e => {
                                        res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR, Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, e));
                                    })
                            }
                            else {
                                Messages.sendObjectMessageAsync(HTTPStatusCodes.OK, CommonConstants.OK, _message)
                                    .then(result => {
                                        res.send(HTTPStatusCodes.OK, result);
                                        resolve(result);
                                    })
                                    .catch(e => {
                                        res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR, Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, e));
                                    })
                            }
                        })
                        .catch(e => {
                            res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                                Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, e)
                            );
                            resolve(Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                                CommonConstants.ERROR,
                                Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, e))
                            );
                        })
                }
                catch (error) {
                    res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, { status: error })
                    );
                    reject(Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        error,
                        method.getMethodName(_self) + ' ' + this.Version)
                    );
                }
            });
        }

        private async checkConnection(connection) {
            return new Promise<any>((resolve, reject) => {
                MongoClient.connect(connection.url, { useNewUrlParser: true, useUnifiedTopology: true }, function (e, dbase) {
                    if (e) {
                        reject(e);
                    }
                    else {
                        resolve(dbase);
                    }
                });

            })
        }

        private async Check(): Promise<any> {

            return new Promise<any>((resolve, reject) => {

                let databases: Array<object> = new Array<object>();
                try {
                    let count = 0;
                    if (connections.length < 1) {
                        databases.push({ error: 'no active connections' });
                        resolve({ api: _apiData, databases: databases });
                    }
                    else {
                        connections.forEach(async connection => {
                            try {
                                await this.checkConnection(connection)
                                    .then(result => {
                                        databases.push({ connectionName: connection.connectionName, databaseName: connection.databaseName, url: connection.url, status: CommonConstants.OK });
                                        if (++count >= connections.length) {
                                            resolve({ api: _apiData, databases: databases });
                                        }
                                    })
                                    .catch(e => {
                                        databases.push({ connectionName: connection.connectionName, databaseName: connection.databaseName, url: connection.url, error: e });
                                        if (++count >= connections.length) {
                                            reject({ api: _apiData, databases: databases });
                                        }
                                    })
                            }
                            catch (e) {
                                databases.push({ connectionName: connection.connectionName, databaseName: connection.databaseName, url: connection.url, error: e });
                                reject({ api: _apiData, databases: databases });
                            }
                        })
                    }
                }
                catch (e) {
                    databases.push({ error: 'connections ' + e });
                    reject({ api: _apiData, databases: databases });
                }
            })
        }
    }
}
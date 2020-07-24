﻿import { restify } from 'restify';

import { Utility } from '../../../utilities/Utility'
import { IHealth } from '../../interfaces/get/IHealth';
import { IMongoDb } from '../../../drivers/interface/IMongoDb';
import { Connection } from '../../models/Connection';

const MongoClient = require('mongodb').MongoClient;



import { Authorization, getMethodName } from '../../decorators/decorators';
import { _apiData } from '../../../../app';
// var connections: Array<Connection> = require('../../../../mongoDatabases.json')

var connections: Array<Connection> = Utility.fileUtility.readFileAsObject('../mongoDatabases.json');


export namespace api100 {

    @Authorization
    export class Health extends Utility.version implements IHealth {

        @getMethodName
        public async Health(req: restify.request, res: restify.response) {
            await this.Check()
                .then(_message => {
                    res.send(HTTPStatusCodes.OK,
                        Utility.Messages.sendObjectMessage(HTTPStatusCodes.OK, CommonConstants.OK, _message)
                    );
                })
                .catch(e => {
                    res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, e)
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

                            Utility.Messages.sendObjectMessageAsync(HTTPStatusCodes.OK, CommonConstants.OK, _message)
                                .then(result => {
                                    res.send(HTTPStatusCodes.OK,result);
                                    resolve(result);
                                })
                                .catch(e => {
                                    res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR, Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, e));
                                })
                        })
                        .catch( e => {
                            res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                                Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, e)
                            );
                            resolve( Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                                CommonConstants.ERROR,
                                Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, e))
                            );
                        })
                }
                catch (error) {
                    res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, CommonConstants.ERROR, { status: error })
                    );
                    reject( Utility.Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                        error,
                        Utility.method.getMethodName(_self) + ' ' + this.Version)
                    );
                }
            });
        }

        private async checkConnection(connection) {
            return new Promise<any>((resolve, reject) => {
                MongoClient.connect(connection.url, { useNewUrlParser: true }, function (e, dbase) {
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

                    //})
                }
                catch (e) {
                    databases.push({ error: 'connections ' + e });
                    reject({ api: _apiData, databases: databases });
                }
            })
        }
    }
}
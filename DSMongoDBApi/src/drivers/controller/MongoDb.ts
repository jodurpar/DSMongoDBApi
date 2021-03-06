﻿/**
 * MongoDb utility module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */

import { IMongoDb } from '../interface/IMongoDb';
import { Connection } from '../../api/models/Connection';


const MongoClient = require('mongodb').MongoClient;
const Mongo = require('mongodb');

import { connections } from '../../../app';


class MongoDb implements IMongoDb {

    databases: any[];

    constructor() {
        this.databases = [];
    }

    public ObjectId(value: string) {
        return new Mongo.ObjectId(value);
    }

    private getDb(connectionName: string, onComplete, onError) {
        try {

            if (connections === undefined || connections.length <= 0) {
                onError(new TypeError('No ' + CommonConstants.CONNECTIONS));
            }

            const connection = connections.filter(x => x.connectionName === connectionName)[0];

            if (connection === undefined) {
                onError(new TypeError(CommonConstants.CONNECTION + ' ' + connectionName + ' ' + CommonConstants.NOTFOUND));
            }
            else {
                let db = this.databases[connectionName];

                if (db == undefined) {
                    const _self = this;
                    MongoClient.connect(connection.url, { useNewUrlParser: true, useUnifiedTopology: true }, function (e, dbase) {
                        try {
                            if (e) {
                                onError(e);
                            }
                            else {
                                db = dbase.db(connection.databaseName);
                                _self.databases[connectionName] = db;
                                onComplete(db);
                            }

                        } catch (e) {
                            onError(e);
                        }
                    });
                }
                else {
                    onComplete(db);
                }
            }
        } catch (e) {
            onError(e);
        }
    }

    private getDbAsync(connectionName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                let connection = connections.filter(x => x.connectionName === connectionName)[0];

                if (connection === undefined) {
                    reject(new TypeError(CommonConstants.CONNECTION + ' ' + connectionName + ' ' + CommonConstants.NOTFOUND));
                }
                else {
                    let db = this.databases[connectionName];
                    if (db == undefined) {
                        let _self = this;
                        MongoClient.connect(connection.url, { useNewUrlParser: true, useUnifiedTopology: true }, function (e, dbase) {
                            try {
                                if (e) {
                                    reject(e);
                                }
                                else {
                                    db = dbase.db(connection.databaseName);
                                    _self.databases[connectionName] = db;
                                    resolve(db);
                                }

                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                    else {
                        reject(db);
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    closeMongo() {
        MongoClient.close({});
    }

    async closeMongoAsync(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            MongoClient.close(function () {
                resolve(CommonConstants.OK);
            });
        })
    }

    async dropCollection(connectionName: string, collectionName: string): Promise<any> {

        return new Promise<boolean>((resolve, reject) => {
            try {
                this.getDb(connectionName, function (db) {
                    if (db === undefined) {
                        reject(false);
                    }
                    else {
                        resolve(db.collection(collectionName).drop());
                    };
                }, function (error) {
                    reject(error);
                })
            }
            catch (e) {
                reject(e);
            }
        });
    }

    addConnection(data: Connection, onComplete, onError) {

        if (data === undefined) {
            onError(CommonConstants.NODATAFORCONNECTION);
            return (CommonConstants.NODATAFORCONNECTION);
        }
        else if (data[CommonConstants.CONNECTIONNAME] !== undefined && data['url'] !== undefined) {
            try {
                connections.push(data);
                onComplete(CommonConstants.OK);
                return (CommonConstants.OK);
            }
            catch (error) {
                onError(error);
                return (error);
            }
        }
        else {
            return (`Bad data ${data[CommonConstants.CONNECTIONNAME]} or ${data['url']}`)
        }
    }

    addConnectionAsync(data: Connection, onComplete, onError) {
        return new Promise<object>(async (resolve, reject) => {
            if (data == undefined) {
                onError(CommonConstants.NODATAFORCONNECTION);
            }
            else if (data[CommonConstants.CONNECTIONNAME] != undefined && data['url'] != undefined) {
                try {
                    connections.push(data);
                    onComplete(CommonConstants.OK);
                    resolve({});
                }
                catch (error) {
                    onError(CommonConstants.ERROR + CommonConstants.TWOPOINTS + ' ' + error);
                    reject(error);
                }
            }
        });
    }

    addConnections(data: Array<Connection>, onComplete, onError) {
        while (connections.length > 0) {
            connections.pop();
        }
        if (data === undefined || !Array.isArray(data) ) {
            onError(CommonConstants.NODATAFORCONNECTION);
            return (CommonConstants.NODATAFORCONNECTION);

        }
        else {
            try {
                for (let j = 0; j < data.length; j++) {
                    connections.push(data[j]);
                }
                onComplete(CommonConstants.OK);
                return (CommonConstants.OK);
            }
            catch (error) {
                onError(error);
                return (error);
            }
        }
    }

    addConnectionsAsync(data: Array<Connection>, onComplete, onError) {
        return new Promise<object>(async (resolve, reject) => {
            if (data == undefined) {
                onError(CommonConstants.NODATAFORCONNECTION);
            }
            else if (data[CommonConstants.CONNECTIONNAME] != undefined && data['url'] != undefined) {
                try {
                    while (connections.length > 0) {
                        connections.pop();
                    }
                    for (let j = 0; j < data.length; j++) {
                        connections.push(data[j]);
                    }
                    onComplete(CommonConstants.OK);
                    resolve({});
                }
                catch (error) {
                    onError(CommonConstants.ERROR + CommonConstants.TWOPOINTS + ' ' + error);
                    reject(error);
                }
            }
        });
    }

    readDocuments(connectionName: string, collection: string, filter: object, selectedFields: object, onComplete, onError) {
        try {
            this.getDb(connectionName, async function (db) {
                if (db === undefined) {
                    onError(CommonConstants.NOCONNECTIONNAME, connectionName);
                }
                else {
                    try {
                        onComplete('', await db.collection(collection).find(filter)
                            .project(selectedFields)
                            .toArray()
                        )
                    } catch (e) {
                        onError(JSON.stringify(e), []);
                    }
                }
            },
                function (e) {
                    onError(e, '');
                });
        }
        catch (e) {
            onError(e, '');
        }
    }

    readDocumentsAsync(connectionName: string, collection: string, filter: object, selectedFields: object): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                await this.getDb(connectionName,
                    function (db) {
                        try {
                            if (db === undefined) {
                                resolve({ error: CommonConstants.NOCONNECTIONNAME });
                            }
                            else {
                                db.collection(collection).find(filter)
                                    .project(selectedFields)
                                    .toArray(function (err, doc) {
                                        if (err) {
                                            reject(err);
                                        }
                                        else {
                                            resolve(doc);
                                        }
                                    });
                            }
                        }
                        catch (e) {
                            reject(e);
                        }
                    },
                    function (e) {
                        reject(e);
                    })
            }
            catch (e) {
                reject(e);
            }
        });
    }

    addDocuments(connectionName: string, collection: string, data: object, onComplete, onError) {
        try {
            this.getDb(connectionName, function (db) {
                if (db === undefined) {
                    onError(CommonConstants.NOCONNECTIONNAME + ' ' + connectionName);
                }
                else {
                    db.collection(collection).insert(data, function (e, doc) {
                        if (e) {
                            onError(e, doc);
                            return;
                        }
                        else {
                            onComplete(CommonConstants.OK, doc);
                            return;
                        }
                    });
                }
            },
                function (e) {
                    onError(e.message);
                    return;
                });
        }
        catch (e) {
            onError(e.message);
        }
    }

    async addDocumentsAsync(connectionName: string, collection: string, data: object): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                this.getDb(connectionName, function (db) {
                    if (db === undefined) {
                        reject(CommonConstants.NOCONNECTIONNAME + ' ' + connectionName);
                    }
                    else {
                        db.collection(collection).insert(data, function (err, doc) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(doc);
                            }
                        });
                    }
                },
                    function (e) {
                        reject(e);
                    });
            }
            catch (e) {
                reject(e);
            }
        });
    }

    deleteDocuments(connectionName: string, collection: string, filter: object, onComplete, onError) {
        try {
            this.getDb(connectionName, function (db) {
                if (db === undefined) {
                    onError(CommonConstants.NOCONNECTIONNAME + ' ' + connectionName);
                }
                else {
                    db.collection(collection).remove(filter, function (e, doc) {
                        if (e) {
                            onError(e, doc);
                        }
                        else {
                            onComplete(CommonConstants.OK, JSON.parse(doc));
                        }
                    });
                }
            },
                function (e) {
                    onError(e.message, '');
                });
        }
        catch (e) {
            onError(e.message, '');
        }
    }

    async deleteDocumentsAsync(connectionName: string, collection: string, filter: object): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                await this.getDb(connectionName, function (db) {
                    if (db === undefined) {
                        reject(CommonConstants.NOCONNECTIONNAME + ' ' + connectionName);
                    }
                    else {
                        db.collection(collection).remove(filter, function (e, doc) {
                            if (e) {
                                reject(e);
                            }
                            else {
                                resolve(JSON.parse(doc));
                            }
                        });
                    }
                },
                    function (e) {
                        reject(e);
                    });
            }
            catch (e) {
                reject(e);
            }
        });
    }

    updateDocument(connectionName: string, collection: string, filter: object, data: object, onComplete, onError) {
        try {
            this.getDb(connectionName, function (db) {
                if (db === undefined) {
                    onError(CommonConstants.NOCONNECTIONNAME + ' ' + connectionName);
                }
                else {
                    db.collection(collection).findOneAndUpdate(filter, data, { multi: true }, function (e, doc) {
                        if (e) {
                            onError(e, doc);
                        }
                        else {
                            onComplete(CommonConstants.OK, doc);
                        }
                    });
                }
            },
                function (e) {
                    onError(e.message, '');
                });
        }
        catch (e) {
            onError(e.message, '');
        }
    }

    async updateDocumentAsync(connectionName: string, collection: string, filter: object, data: object): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                await this.getDb(connectionName, function (db) {
                    if (db === undefined) {
                        reject(CommonConstants.NOCONNECTIONNAME + ' ' + connectionName);
                    }
                    else {
                        db.collection(collection).findOneAndUpdate(filter, data, { multi: true }, function (e, doc) {
                            if (e) {
                                reject(e);
                            }
                            else {
                                resolve(doc);
                            }
                        });
                    }
                },
                    function (e) {
                        reject(e);
                    });
            }
            catch (e) {
                reject(e);
            }
        });
    }

    updateDocuments(connectionName: string, collection: string, filter: object, data: object, onComplete, onError) {
        try {
            this.getDb(connectionName, function (db) {
                if (db === undefined) {
                    onError(CommonConstants.NOCONNECTIONNAME + ' ' + connectionName);
                }
                else {
                    db.collection(collection).updateMany(filter, data, function (e, doc) {
                        if (e) {
                            onError(e, doc);
                        }
                        else {
                            onComplete(CommonConstants.OK, doc);
                        }
                    });
                }
            },
                function (e) {
                    onError(e.message, '');
                });
        }
        catch (e) {
            onError(e.message, '');
        }
    }

    async updateDocumentsAsync(connectionName: string, collection: string, filter: object, data: object): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                this.getDb(connectionName, function (db) {
                    if (db === undefined) {
                        reject(CommonConstants.NOCONNECTIONNAME + ' ' + connectionName);
                    }
                    else {
                        db.collection(collection).updateMany(filter, data, function (e, doc) {
                            if (e) {
                                reject(e);
                            }
                            else {
                                resolve(doc);
                            }
                        });
                    }
                },
                    function (e) {
                        reject(e);
                    });
            }
            catch (e) {
                reject(e);
            }
        });
    }

}
export = new MongoDb();
//}
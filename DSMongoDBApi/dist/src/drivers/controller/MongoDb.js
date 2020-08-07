"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Utility_1 = require("../../utilities/Utility");
const MongoClient = require('mongodb').MongoClient;
const Mongo = require('mongodb');
var connections = Utility_1.Utility.fileUtility.readFileAsObject('../mongoDatabases.json');
class MongoDb {
    constructor() {
        this.databases = [];
    }
    ObjectId(value) {
        return new Mongo.ObjectId(value);
    }
    getDb(connectionName, onComplete, onError) {
        try {
            if (connections === undefined || connections.length <= 0) {
                onError(new TypeError('No ' + "Connections" /* CONNECTIONS */));
            }
            const connection = connections.filter(x => x.connectionName === connectionName)[0];
            if (connection === undefined) {
                onError(new TypeError("Connection" /* CONNECTION */ + ' ' + connectionName + ' ' + "not found" /* NOTFOUND */));
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
                        }
                        catch (e) {
                            onError(e);
                        }
                    });
                }
                else {
                    onComplete(db);
                }
            }
        }
        catch (e) {
            onError(e);
        }
    }
    getDbAsync(connectionName) {
        return new Promise((resolve, reject) => {
            try {
                let connection = connections.filter(x => x.connectionName === connectionName)[0];
                if (connection === undefined) {
                    reject(new TypeError("Connection" /* CONNECTION */ + ' ' + connectionName + ' ' + "not found" /* NOTFOUND */));
                }
                else {
                    let db = this.databases[connectionName];
                    if (db == undefined) {
                        let _self = this;
                        MongoClient.connect(connection.url, { useNewUrlParser: true }, function (e, dbase) {
                            try {
                                if (e) {
                                    reject(e);
                                }
                                else {
                                    db = dbase.db(connection.databaseName);
                                    _self.databases[connectionName] = db;
                                    resolve(db);
                                }
                            }
                            catch (e) {
                                reject(e);
                            }
                        });
                    }
                    else {
                        reject(db);
                    }
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }
    closeMongo() {
        MongoClient.close({});
    }
    closeMongoAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                MongoClient.close(function () {
                    resolve("Ok" /* OK */);
                });
            });
        });
    }
    dropCollection(connectionName, collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    this.getDb(connectionName, function (db) {
                        if (db === undefined) {
                            reject(false);
                        }
                        else {
                            resolve(db.collection(collectionName).drop());
                        }
                        ;
                    }, function (error) {
                        reject(error);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    addConnection(data, onComplete, onError) {
        if (data === undefined) {
            onError("No data for connection" /* NODATAFORCONNECTION */);
            return ("No data for connection" /* NODATAFORCONNECTION */);
        }
        else if (data["ConnectionName" /* CONNECTIONNAME */] != undefined && data['url'] != undefined) {
            try {
                let connection = { connectionName: data["ConnectionName" /* CONNECTIONNAME */], databaseName: data["databaseName" /* DATABASENAME */], url: data['url'], type: data['type'], user: data['user'], password: data['password'], encrypted: data['encrypted'] };
                if (connections === undefined)
                    connections = new Array();
                connections.push(connection);
                onComplete("Ok" /* OK */);
                return ("Ok" /* OK */);
            }
            catch (error) {
                onError(error);
                return (error);
            }
        }
    }
    addConnectionAsync(data, onComplete, onError) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (data == undefined) {
                onError("No data for connection" /* NODATAFORCONNECTION */);
            }
            else if (data["ConnectionName" /* CONNECTIONNAME */] != undefined && data['url'] != undefined) {
                try {
                    let connection = { connectionName: data["ConnectionName" /* CONNECTIONNAME */], databaseName: data["databaseName" /* DATABASENAME */], url: data['url'], type: data['type'], user: data['user'], password: data['password'], encrypted: data['encrypted'] };
                    if (connections === undefined)
                        connections = new Array();
                    connections.push(connection);
                    onComplete("Ok" /* OK */);
                    resolve({});
                }
                catch (error) {
                    onError("Error" /* ERROR */ + ":" /* TWOPOINTS */ + ' ' + error);
                    reject(error);
                }
            }
        }));
    }
    readDocuments(connectionName, collection, filter, selectedFields, onComplete, onError) {
        try {
            this.getDb(connectionName, function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (db === undefined) {
                        onError("No connection name" /* NOCONNECTIONNAME */, connectionName);
                    }
                    else {
                        try {
                            onComplete('', yield db.collection(collection).find(filter)
                                .project(selectedFields)
                                .toArray());
                        }
                        catch (e) {
                            onError(JSON.stringify(e), []);
                        }
                    }
                });
            }, function (e) {
                onError(e, '');
            });
        }
        catch (e) {
            onError(e, '');
        }
    }
    readDocumentsAsync(connectionName, collection, filter, selectedFields) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getDb(connectionName, function (db) {
                    try {
                        if (db === undefined) {
                            resolve({ error: "No connection name" /* NOCONNECTIONNAME */ });
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
                }, function (e) {
                    reject(e);
                });
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    addDocuments(connectionName, collection, data, onComplete, onError) {
        try {
            this.getDb(connectionName, function (db) {
                if (db === undefined) {
                    onError("No connection name" /* NOCONNECTIONNAME */ + ' ' + connectionName);
                }
                else {
                    db.collection(collection).insert(data, function (e, doc) {
                        if (e) {
                            onError(e, doc);
                            return;
                        }
                        else {
                            onComplete("Ok" /* OK */, doc);
                            return;
                        }
                    });
                }
            }, function (e) {
                onError(e.message);
                return;
            });
        }
        catch (e) {
            onError(e.message);
        }
    }
    addDocumentsAsync(connectionName, collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    this.getDb(connectionName, function (db) {
                        if (db === undefined) {
                            reject("No connection name" /* NOCONNECTIONNAME */ + ' ' + connectionName);
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
                    }, function (e) {
                        reject(e);
                    });
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    deleteDocuments(connectionName, collection, filter, onComplete, onError) {
        try {
            this.getDb(connectionName, function (db) {
                if (db === undefined) {
                    onError("No connection name" /* NOCONNECTIONNAME */ + ' ' + connectionName);
                }
                else {
                    db.collection(collection).remove(filter, function (e, doc) {
                        if (e) {
                            onError(e, doc);
                        }
                        else {
                            onComplete("Ok" /* OK */, JSON.parse(doc));
                        }
                    });
                }
            }, function (e) {
                onError(e.message, '');
            });
        }
        catch (e) {
            onError(e.message, '');
        }
    }
    deleteDocumentsAsync(connectionName, collection, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.getDb(connectionName, function (db) {
                        if (db === undefined) {
                            reject("No connection name" /* NOCONNECTIONNAME */ + ' ' + connectionName);
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
                    }, function (e) {
                        reject(e);
                    });
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    updateDocument(connectionName, collection, filter, data, onComplete, onError) {
        try {
            this.getDb(connectionName, function (db) {
                if (db === undefined) {
                    onError("No connection name" /* NOCONNECTIONNAME */ + ' ' + connectionName);
                }
                else {
                    db.collection(collection).findOneAndUpdate(filter, data, { multi: true }, function (e, doc) {
                        if (e) {
                            onError(e, doc);
                        }
                        else {
                            onComplete("Ok" /* OK */, doc);
                        }
                    });
                }
            }, function (e) {
                onError(e.message, '');
            });
        }
        catch (e) {
            onError(e.message, '');
        }
    }
    updateDocumentAsync(connectionName, collection, filter, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.getDb(connectionName, function (db) {
                        if (db === undefined) {
                            reject("No connection name" /* NOCONNECTIONNAME */ + ' ' + connectionName);
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
                    }, function (e) {
                        reject(e);
                    });
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    updateDocuments(connectionName, collection, filter, data, onComplete, onError) {
        try {
            this.getDb(connectionName, function (db) {
                if (db === undefined) {
                    onError("No connection name" /* NOCONNECTIONNAME */ + ' ' + connectionName);
                }
                else {
                    db.collection(collection).updateMany(filter, data, function (e, doc) {
                        if (e) {
                            onError(e, doc);
                        }
                        else {
                            onComplete("Ok" /* OK */, doc);
                        }
                    });
                }
            }, function (e) {
                onError(e.message, '');
            });
        }
        catch (e) {
            onError(e.message, '');
        }
    }
    updateDocumentsAsync(connectionName, collection, filter, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    this.getDb(connectionName, function (db) {
                        if (db === undefined) {
                            reject("No connection name" /* NOCONNECTIONNAME */ + ' ' + connectionName);
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
                    }, function (e) {
                        reject(e);
                    });
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
}
module.exports = new MongoDb();
//}
//# sourceMappingURL=MongoDb.js.map
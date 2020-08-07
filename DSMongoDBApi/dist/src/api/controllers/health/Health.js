"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api100 = void 0;
const Utility_1 = require("../../../utilities/Utility");
const MongoClient = require('mongodb').MongoClient;
const decorators_1 = require("../../decorators/decorators");
const app_1 = require("../../../../app");
var connections = Utility_1.Utility.fileUtility.readFileAsObject('./mongoDatabases.json');
var api100;
(function (api100) {
    let Health = class Health extends Utility_1.Utility.version {
        Health(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.Check()
                    .then(_message => {
                    res.send(200 /* OK */, Utility_1.Utility.Messages.sendObjectMessage(200 /* OK */, "Ok" /* OK */, _message));
                })
                    .catch(e => {
                    res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, "Error" /* ERROR */, e));
                });
            });
        }
        HealthAsync(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let _self = this;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield this.Check()
                            .then(_message => {
                            Utility_1.Utility.Messages.sendObjectMessageAsync(200 /* OK */, "Ok" /* OK */, _message)
                                .then(result => {
                                res.send(200 /* OK */, result);
                                resolve(result);
                            })
                                .catch(e => {
                                res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, "Error" /* ERROR */, e));
                            });
                        })
                            .catch(e => {
                            res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, "Error" /* ERROR */, e));
                            resolve(Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, "Error" /* ERROR */, Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, "Error" /* ERROR */, e)));
                        });
                    }
                    catch (error) {
                        res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, "Error" /* ERROR */, { status: error }));
                        reject(Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, error, Utility_1.Utility.method.getMethodName(_self) + ' ' + this.Version));
                    }
                }));
            });
        }
        checkConnection(connection) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    MongoClient.connect(connection.url, { useNewUrlParser: true }, function (e, dbase) {
                        if (e) {
                            reject(e);
                        }
                        else {
                            resolve(dbase);
                        }
                    });
                });
            });
        }
        Check() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    let databases = new Array();
                    try {
                        let count = 0;
                        connections.forEach((connection) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                yield this.checkConnection(connection)
                                    .then(result => {
                                    databases.push({ connectionName: connection.connectionName, databaseName: connection.databaseName, url: connection.url, status: "Ok" /* OK */ });
                                    if (++count >= connections.length) {
                                        resolve({ api: app_1._apiData, databases: databases });
                                    }
                                })
                                    .catch(e => {
                                    databases.push({ connectionName: connection.connectionName, databaseName: connection.databaseName, url: connection.url, error: e });
                                    if (++count >= connections.length) {
                                        reject({ api: app_1._apiData, databases: databases });
                                    }
                                });
                            }
                            catch (e) {
                                databases.push({ connectionName: connection.connectionName, databaseName: connection.databaseName, url: connection.url, error: e });
                                reject({ api: app_1._apiData, databases: databases });
                            }
                        }));
                        //})
                    }
                    catch (e) {
                        if (connections) {
                            databases.push({ error: 'no active connections' });
                        }
                        else {
                            databases.push({ error: 'connections ' + e });
                        }
                        reject({ api: app_1._apiData, databases: databases });
                    }
                });
            });
        }
    };
    __decorate([
        decorators_1.getMethodName
    ], Health.prototype, "Health", null);
    __decorate([
        decorators_1.getMethodName
    ], Health.prototype, "HealthAsync", null);
    Health = __decorate([
        decorators_1.Authorization
    ], Health);
    api100.Health = Health;
})(api100 = exports.api100 || (exports.api100 = {}));
//# sourceMappingURL=Health.js.map
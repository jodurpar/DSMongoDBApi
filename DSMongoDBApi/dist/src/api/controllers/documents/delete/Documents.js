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
const Utility_1 = require("../../../../utilities/Utility");
const MongoDb = require("../../../../drivers/controller/MongoDb");
const decorators_1 = require("../../../decorators/decorators");
var api100;
(function (api100) {
    let Documents = class Documents extends Utility_1.version {
        DeleteDocuments(req, res) {
            const _self = this;
            try {
                let [database, collection, filter] = Utility_1.params.assign(req);
                if (filter['_id'] !== undefined) {
                    filter = { _id: MongoDb.ObjectId(filter['_id']) };
                }
                MongoDb.deleteDocuments(database, collection, filter, function (err, doc) {
                    if (doc === undefined || doc === null || doc.n === undefined || doc.n === 0) {
                        const error = Utility_1.status.getStatusFromMessage("not found" /* NOTFOUND */);
                        res.send(error, Utility_1.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + "not found" /* NOTFOUND */, Utility_1.method.getMethodName(_self)));
                    }
                    else {
                        res.send(200 /* OK */, Utility_1.Messages.sendObjectMessage(200 /* OK */, err, doc));
                    }
                }, function (e) {
                    res.send(Utility_1.status.getStatusFromMessage(e.message), Utility_1.Messages.sendObjectMessage(Utility_1.status.getStatusFromMessage(e.message), e.message, Utility_1.method.getMethodName(_self)));
                });
            }
            catch (e) {
                const error = Utility_1.status.getStatusFromMessage(e.message);
                res.send(error, Utility_1.Messages.sendObjectMessage(error, e.message, Utility_1.method.getMethodName(_self)));
            }
        }
        DeleteDocumentsAsync(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const _self = this;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let [database, collection, filter] = Utility_1.params.assign(req);
                        if (filter['_id'] !== undefined) {
                            filter = { _id: MongoDb.ObjectId(filter['_id']) };
                        }
                        yield MongoDb.deleteDocumentsAsync(database, collection, filter)
                            .then((results) => __awaiter(this, void 0, void 0, function* () {
                            if (results === undefined || results === null || results.n === undefined || results.n === 0) {
                                const error = Utility_1.status.getStatusFromMessage("not found" /* NOTFOUND */);
                                resolve(yield res.send(error, Utility_1.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + "not found" /* NOTFOUND */, Utility_1.method.getMethodName(_self))));
                            }
                            else {
                                resolve(yield res.send(200 /* OK */, Utility_1.Messages.sendObjectMessage(200 /* OK */, "Ok" /* OK */, results)));
                            }
                        }))
                            .catch((e) => __awaiter(this, void 0, void 0, function* () {
                            const error = Utility_1.status.getStatusFromMessage(e.message);
                            reject(yield res.send(error, Utility_1.Messages.sendObjectMessage(error, e.message, Utility_1.method.getMethodName(_self))));
                        }));
                    }
                    catch (e) {
                        const error = Utility_1.status.getStatusFromMessage(e.message);
                        reject(yield res.send(error, Utility_1.Messages.sendObjectMessage(error, e.message, Utility_1.method.getMethodName(_self))));
                    }
                }));
            });
        }
    };
    __decorate([
        decorators_1.getMethodName
    ], Documents.prototype, "DeleteDocuments", null);
    __decorate([
        decorators_1.getMethodName
    ], Documents.prototype, "DeleteDocumentsAsync", null);
    Documents = __decorate([
        decorators_1.Authorization
    ], Documents);
    api100.Documents = Documents;
})(api100 = exports.api100 || (exports.api100 = {}));

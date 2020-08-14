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
        PatchDocuments(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const _self = this;
                try {
                    let [database, collection, filter, data, options] = Utility_1.params.assign(req);
                    const updateData = { $set: data };
                    if (filter['_id'] !== undefined) {
                        filter = { _id: MongoDb.ObjectId(filter['_id']) };
                    }
                    if (options !== undefined && options["multi" /* MULTI */] === "true" /* TRUE */) {
                        yield MongoDb.updateDocuments(database, collection, filter, updateData, function (err, doc) {
                            if (doc === undefined || doc === null || doc.value === undefined || doc.value === null) {
                                const error = Utility_1.status.getStatusFromMessage("not found" /* NOTFOUND */);
                                res.send(error, Utility_1.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + "not found" /* NOTFOUND */, Utility_1.method.getMethodName(_self)));
                            }
                            else {
                                res.send(200 /* OK */, doc.value);
                            }
                        }, function (e) {
                            const error = Utility_1.status.getStatusFromMessage(e.message);
                            res.send(error, Utility_1.Messages.sendObjectMessage(error, e.message, Utility_1.method.getMethodName(_self)));
                        });
                    }
                    else {
                        yield MongoDb.updateDocument(database, collection, filter, updateData, function (err, doc) {
                            if (doc === undefined || doc === null || doc.value === undefined || doc.value === null) {
                                const error = Utility_1.status.getStatusFromMessage("not found" /* NOTFOUND */);
                                res.send(error, Utility_1.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + "not found" /* NOTFOUND */, Utility_1.method.getMethodName(_self)));
                            }
                            else {
                                res.send(200 /* OK */, doc.value);
                            }
                        }, function (e) {
                            const error = Utility_1.status.getStatusFromMessage(e.message);
                            res.send(error, Utility_1.Messages.sendObjectMessage(error, e.message, Utility_1.method.getMethodName(_self)));
                        });
                    }
                }
                catch (e) {
                    const error = Utility_1.status.getStatusFromMessage(e.message);
                    res.send(error, Utility_1.Messages.sendObjectMessage(error, e.message, Utility_1.method.getMethodName(_self)));
                }
            });
        }
        PatchDocumentsAsync(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const _self = this;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let [database, collection, filter, data, options] = Utility_1.params.assign(req);
                        const updateData = { $set: data };
                        if (filter['_id'] !== undefined) {
                            filter = { _id: MongoDb.ObjectId(filter['_id']) };
                        }
                        if (options !== undefined && options["multi" /* MULTI */] === "true" /* TRUE */) {
                            yield MongoDb.updateDocumentsAsync(database, collection, filter, updateData)
                                .then((results) => __awaiter(this, void 0, void 0, function* () {
                                if (results === undefined || results === null || results.value === undefined || results.value === null) {
                                    const error = Utility_1.status.getStatusFromMessage("not found" /* NOTFOUND */);
                                    resolve(yield res.send(error, Utility_1.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + "not found" /* NOTFOUND */, Utility_1.method.getMethodName(_self))));
                                }
                                else {
                                    resolve(yield res.send(200 /* OK */, results.value));
                                }
                            }))
                                .catch((e) => __awaiter(this, void 0, void 0, function* () {
                                const error = Utility_1.status.getStatusFromMessage(e);
                                resolve(yield res.send(error, Utility_1.Messages.sendObjectMessage(error, e.message, Utility_1.method.getMethodName(_self))));
                            }));
                        }
                        else {
                            yield MongoDb.updateDocumentAsync(database, collection, filter, updateData)
                                .then((results) => __awaiter(this, void 0, void 0, function* () {
                                if (results === undefined || results === null || results.value === undefined || results.value === null) {
                                    const error = Utility_1.status.getStatusFromMessage("not found" /* NOTFOUND */);
                                    resolve(yield res.send(error, Utility_1.Messages.sendObjectMessage(error, JSON.stringify(filter) + ': ' + "not found" /* NOTFOUND */, Utility_1.method.getMethodName(_self))));
                                }
                                else {
                                    resolve(yield res.send(200 /* OK */, results.value));
                                }
                            }))
                                .catch((e) => __awaiter(this, void 0, void 0, function* () {
                                const error = Utility_1.status.getStatusFromMessage(e.message);
                                resolve(yield res.send(error, Utility_1.Messages.sendObjectMessage(error, e.message, Utility_1.method.getMethodName(_self))));
                            }));
                        }
                    }
                    catch (e) {
                        const error = Utility_1.status.getStatusFromMessage(e.message);
                        resolve(yield res.send(error, Utility_1.Messages.sendObjectMessage(error, e.message, Utility_1.method.getMethodName(_self))));
                    }
                }));
            });
        }
    };
    __decorate([
        decorators_1.getMethodName
    ], Documents.prototype, "PatchDocuments", null);
    __decorate([
        decorators_1.getMethodName
    ], Documents.prototype, "PatchDocumentsAsync", null);
    Documents = __decorate([
        decorators_1.Authorization
    ], Documents);
    api100.Documents = Documents;
})(api100 = exports.api100 || (exports.api100 = {}));
//# sourceMappingURL=Documents.js.map
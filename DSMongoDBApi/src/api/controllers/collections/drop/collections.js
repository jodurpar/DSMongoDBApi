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
    let collections = class collections extends Utility_1.version {
        dropCollection(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let _self = this;
                let [database, collection] = Utility_1.params.assign(req);
                yield MongoDb.dropCollection(database, collection)
                    .then(value => {
                    if (value == true) {
                        res.send(200 /* OK */, Utility_1.Messages.sendObjectMessage(200 /* OK */, "Ok" /* OK */, undefined));
                    }
                    else {
                        res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, Utility_1.stringsUtility.format('{0}{1} {2} {3} {4}{5} {6} {7}', "Collection" /* COLLECTION */, ":" /* TWOPOINTS */, collection, "in" /* IN */, "Database" /* DATABASE */, ":" /* TWOPOINTS */, database, "can't be deleted" /* CANTBEDELETED */), Utility_1.method.getMethodName(_self)));
                    }
                })
                    .catch(e => {
                    res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, Utility_1.method.getMethodName(_self)));
                });
            });
        }
        dropCollectionAsync(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let _self = this;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let [database, collection] = Utility_1.params.assign(req);
                    yield MongoDb.dropCollection(database, collection)
                        .then((value) => __awaiter(this, void 0, void 0, function* () {
                        if (value == true) {
                            resolve(yield Utility_1.Messages.sendObjectMessage(200 /* OK */, "Ok" /* OK */, undefined));
                        }
                        else {
                            reject(yield Utility_1.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, Utility_1.stringsUtility.format('{0}{1} {2} {3} {4}{5} {6} {7}', "Collection" /* COLLECTION */, ":" /* TWOPOINTS */, collection, "in" /* IN */, "Database" /* DATABASE */, ":" /* TWOPOINTS */, database, "can't be deleted" /* CANTBEDELETED */), Utility_1.method.getMethodName(_self)));
                        }
                    }))
                        .catch((e) => __awaiter(this, void 0, void 0, function* () {
                        reject(yield Utility_1.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, Utility_1.method.getMethodName(_self)));
                    }));
                }));
            });
        }
    };
    __decorate([
        decorators_1.getMethodName
    ], collections.prototype, "dropCollection", null);
    __decorate([
        decorators_1.getMethodName
    ], collections.prototype, "dropCollectionAsync", null);
    collections = __decorate([
        decorators_1.Authorization
    ], collections);
    api100.collections = collections;
})(api100 = exports.api100 || (exports.api100 = {}));
//# sourceMappingURL=collections.js.map
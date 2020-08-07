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
const Bunyan = require("../../../../utilities/Bunyan");
var api100;
(function (api100) {
    let connections = class connections extends Utility_1.Utility.version {
        addConnection(req, res) {
            let _self = this;
            Bunyan.Log.info('entra');
            try {
                console.log(`connections: ${req.params.connection}`);
                MongoDb.addConnection(JSON.parse(req.params.connection), function (err, doc) {
                    res.send(200 /* OK */, Utility_1.Utility.Messages.sendObjectMessage(200 /* OK */, 'Connection set to:' + req.params.connections, Utility_1.Utility.method.getMethodName(_self)));
                }, function (e, doc) {
                    res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, Utility_1.Utility.method.getMethodName(_self)));
                });
            }
            catch (e) {
                res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, Utility_1.Utility.stringsUtility.format('{0} {1} {2}', Utility_1.Utility.method.getMethodName(_self), ":" /* TWOPOINTS */, req.params.connection)));
            }
        }
        addConnectionAsync(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let _self = this;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield MongoDb.addConnectionAsync(JSON.parse(req.params.connection), function (err, doc) {
                            return __awaiter(this, void 0, void 0, function* () {
                                resolve(yield res.send(200 /* OK */, Utility_1.Utility.Messages.sendObjectMessage(200 /* OK */, err, doc)));
                            });
                        }, function (e, doc) {
                            return __awaiter(this, void 0, void 0, function* () {
                                reject(res.send(500 /* INTERNAL_SERVER_ERROR */, yield Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, Utility_1.Utility.method.getMethodName(_self))));
                            });
                        });
                    }
                    catch (e) {
                        reject(res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, Utility_1.Utility.stringsUtility.format('{0} {1} {2}', Utility_1.Utility.method.getMethodName(_self), ":" /* TWOPOINTS */, req.params.connection))));
                    }
                }));
            });
        }
    };
    __decorate([
        decorators_1.getMethodName
    ], connections.prototype, "addConnection", null);
    __decorate([
        decorators_1.getMethodName
    ], connections.prototype, "addConnectionAsync", null);
    connections = __decorate([
        decorators_1.Authorization
    ], connections);
    api100.connections = connections;
})(api100 = exports.api100 || (exports.api100 = {}));
//# sourceMappingURL=connections.js.map
"use strict";
/**
 * Add multiple Connections module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api100 = void 0;
const Utility_1 = require("../../../../utilities/Utility");
const MongoDb = require("../../../../drivers/controller/MongoDb");
const decorators_1 = require("../../../decorators/decorators");
var api100;
(function (api100) {
    let connections = class connections extends Utility_1.version {
        addConnections(req, res) {
            let _self = this;
            try {
                MongoDb.addConnections(JSON.parse(req.params.connections), function (err, doc) {
                    res.send(200 /* OK */, Utility_1.Messages.sendObjectMessage(200 /* OK */, 'Connection set to:' + req.params.connections, Utility_1.method.getMethodName(_self)));
                }, function (e, doc) {
                    res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, Utility_1.method.getMethodName(_self)));
                });
            }
            catch (e) {
                res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, Utility_1.stringsUtility.format('{0} {1} {2}', Utility_1.method.getMethodName(_self), ":" /* TWOPOINTS */, req.params.connection)));
            }
        }
    };
    __decorate([
        decorators_1.getMethodName
    ], connections.prototype, "addConnections", null);
    connections = __decorate([
        decorators_1.Authorization
    ], connections);
    api100.connections = connections;
})(api100 = exports.api100 || (exports.api100 = {}));

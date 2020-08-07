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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGeneralRoute = void 0;
const common_1 = require("../common/common");
const Utility_1 = require("../../utilities/Utility");
class setGeneralRoute {
    constructor() { }
    static Set(server, verb, route, asyncRoute, params, pathName, className, methodName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.SetSync(server, verb, route, params, pathName, className, methodName);
            if (asyncRoute != undefined) {
                yield this.SetAsync(server, verb, asyncRoute, params, pathName, className, methodName + "Async" /* ASYNC */);
            }
        });
    }
    static SetSync(server, verb, route, params, pathName, className, methodName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield server[verb](route + params, function (req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            resolve(common_1.Common.executeSync(req, res, next, pathName, className + '.' + methodName));
                        }
                        catch (e) {
                            reject(Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, className + "." /* POINT */ + methodName));
                        }
                    }));
                });
            });
        });
    }
    static SetAsync(server, verb, route, params, pathName, className, methodName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield server[verb](route + params, function (req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                resolve(yield common_1.Common.executeAsync(req, res, next, pathName, className + "." /* POINT */ + methodName));
                            }
                            catch (e) {
                                reject(Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, className + "." /* POINT */ + methodName));
                            }
                        }));
                    }
                    catch (e) {
                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                resolve(yield common_1.Common.executeAsync(req, res, next, pathName, className + '.' + methodName));
                            }
                            catch (e) {
                                reject(Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, className + "." /* POINT */ + methodName));
                            }
                        }));
                    }
                });
            });
        });
    }
}
exports.setGeneralRoute = setGeneralRoute;
//# sourceMappingURL=setGeneralRoute.js.map
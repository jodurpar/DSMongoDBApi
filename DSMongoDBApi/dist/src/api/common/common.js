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
exports.Common = void 0;
const Utility_1 = require("../../utilities/Utility");
class Common extends Utility_1.Utility.version {
    static executeFunctionByName(functionName, context, req, res) {
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        try {
            let _context = new context;
            return (_context)[func].call(_context, req, res);
        }
        catch (e) {
            return e;
        }
    }
    static executeFunctionByNameAsync(functionName, context, req, res) {
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        let _context = new context;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    resolve(yield (_context)[func].call(_context, req, res));
                }
                catch (e) {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    static createClassByName(functionName, context) {
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        try {
            return new context;
        }
        catch (e) {
            var message = e;
        }
    }
    static getPropertyByName(functionName, context) {
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        try {
            return new context;
        }
        catch (e) {
            var message = e;
        }
    }
    static getApiVersion(req) {
        return req.headers["accept-version" /* ACCEPTVERSION */].replace(/\./g, "");
    }
    static executeSync(req, res, next, classRoute, apiRoute) {
        let ApiCalls;
        try {
            let apiVersion = req.headers["accept-version" /* ACCEPTVERSION */].replace(/\./g, "");
            ApiCalls = apiRoute.split('.');
            if (ApiCalls.length > 1) {
                var selectedNamespace = Promise.resolve().then(() => require('../controllers' + classRoute + '/' + ApiCalls[0]));
                selectedNamespace
                    .then((k) => {
                    try {
                        Common.executeFunctionByName('api' + apiVersion + '.' + apiRoute, k, req, res);
                    }
                    catch (e) {
                        return e.message;
                    }
                })
                    .catch(function (e) {
                    res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, ApiCalls[1] + ': ' + req.headers['accept-version']));
                });
            }
            else
                throw 'Bad route: ' + apiRoute;
        }
        catch (e) {
            res.send(500 /* INTERNAL_SERVER_ERROR */, Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, ApiCalls[1] + ': ' + req.headers['accept-version']));
        }
        finally {
            next();
        }
    }
    static executeAsync(req, res, next, classRoute, apiRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            let ApiCalls;
            try {
                let apiVersion = req.headers["accept-version" /* ACCEPTVERSION */].replace(/\./g, "");
                ApiCalls = apiRoute.split('.');
                if (ApiCalls.length > 1) {
                    var selectedNamespace = Promise.resolve().then(() => require('../controllers' + classRoute + '/' + ApiCalls[0]));
                    selectedNamespace
                        .then((k) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield Common.executeFunctionByNameAsync('api' + apiVersion + '.' + apiRoute, k, req, res)
                                .then(() => {
                            })
                                .catch(() => {
                            });
                        }
                        catch (e) {
                            res.send(Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, req.getRoute()));
                        }
                    }))
                        .catch(function (e) {
                        res.send(Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, ApiCalls[1] + ': ' + req.headers["accept-version" /* ACCEPTVERSION */]));
                    });
                }
                else
                    res.send(Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, 'Bad route:' + apiRoute, ApiCalls[1] + ': ' + req.headers["accept-version" /* ACCEPTVERSION */]));
            }
            catch (e) {
                res.send(Utility_1.Utility.Messages.sendObjectMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, ApiCalls[1] + ': ' + req.headers["accept-version" /* ACCEPTVERSION */]));
            }
            finally {
                next();
            }
        });
    }
}
exports.Common = Common;

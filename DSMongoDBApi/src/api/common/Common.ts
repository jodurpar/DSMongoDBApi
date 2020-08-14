

import { Messages, version } from '../../utilities/Utility';
import { api100 } from '../controllers/messages/Messages';

export class Common extends version {

    public static executeFunctionByName(functionName, context, req, res): any {
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        try {
            let _context = new context;
            return (_context)[func].call(_context, req, res);
        } catch (e) {
            return e;
        }
    }

    public static executeFunctionByNameAsync(functionName, context, req, res): Promise<any> {
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        let _context = new context;
        return new Promise<any>(async (resolve, reject) => {
            try {
                try {
                    resolve (await (_context)[func].call(_context, req, res));
                } catch (e) {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }



    public static createClassByName(functionName, context): any {
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        try {
            return new context;
        } catch (e) {
            var message = e;
        }

    }

    public static getPropertyByName(functionName, context): any {
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        try {
            return new context;

        } catch (e) {
            var message = e;
        }

    }

    public static getApiVersion(req): string {
        return req.headers[CommonConstants.ACCEPTVERSION].replace(/\./g, "")
    }



    public static executeSync(req, res, next, classRoute, apiRoute) {

        let ApiCalls;
        try {
            let apiVersion = req.headers[CommonConstants.ACCEPTVERSION].replace(/\./g, "");

            ApiCalls = apiRoute.split('.');
            if (ApiCalls.length > 1) {

                var selectedNamespace = import('../controllers' + classRoute + '/' + ApiCalls[0]) as Promise<typeof api100>;
                selectedNamespace
                    .then((k) => {
                        try {
                            Common.executeFunctionByName('api' + apiVersion + '.' + apiRoute, k, req, res);
                        } catch (e) {
                            return e.message;
                        }
                    })
                    .catch(function (e) {
                        res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR, Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, e.message, ApiCalls[1] + ': ' + req.headers['accept-version']));
                    });
            }
            else throw 'Bad route: ' + apiRoute;

        } catch (e) {
            res.send(HTTPStatusCodes.INTERNAL_SERVER_ERROR, Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, e.message, ApiCalls[1] + ': ' + req.headers['accept-version']));
        }
        finally {
            next();
        }

    }


    public static async executeAsync(req, res, next, classRoute, apiRoute) {

        let ApiCalls;
        try {
            let apiVersion = req.headers[CommonConstants.ACCEPTVERSION].replace(/\./g, "");

            ApiCalls = apiRoute.split('.');
            if (ApiCalls.length > 1) {

                var selectedNamespace = import('../controllers' + classRoute + '/' + ApiCalls[0]) as Promise<typeof api100>;
                selectedNamespace
                    .then(async (k) => {
                        try {
                            await Common.executeFunctionByNameAsync('api' + apiVersion + '.' + apiRoute, k, req, res)
                                .then(() => {
                                })
                                .catch(() => {
                                });
                        } catch (e) {
                            res.send(Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, e.message, req.getRoute()));
                        }
                    })
                    .catch(function (e) {
                        res.send(Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, e.message, ApiCalls[1] + ': ' + req.headers[CommonConstants.ACCEPTVERSION]));
                    });
            }
            else res.send(Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, 'Bad route:' + apiRoute, ApiCalls[1] + ': ' + req.headers[CommonConstants.ACCEPTVERSION]));

        } catch (e) {
            res.send(Messages.sendObjectMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, e.message, ApiCalls[1] + ': ' + req.headers[CommonConstants.ACCEPTVERSION]));
        }
        finally {
            next();
        }

    }


}


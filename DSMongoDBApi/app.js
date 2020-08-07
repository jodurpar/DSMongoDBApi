"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.connections = exports._apiData = void 0;
const restify = require("restify");
const Bunyan = require("./src/utilities/Bunyan");
const Utility_1 = require("./src/utilities/Utility");
const routes_1 = require("./src/api/routes/routes");
const apiData_1 = require("./src/api/common/apiData");
const corssMidleware = require('restify-cors-middleware');
exports._apiData = apiData_1.apiData;
exports.connections = Utility_1.Utility.fileUtility.readFileAsObject('./mongoDatabases.json');
if (exports.connections === undefined || !Array.isArray(exports.connections))
    exports.connections = new Array();
// #region apiData
for (let j = 0; j < process.argv.length; j++) {
    let arg = process.argv[j].toLowerCase();
    switch (arg) {
        case '--host':
        case '--h':
            exports._apiData.apiHost = process.argv[j + 1];
            break;
        case '--port':
        case '--p':
            exports._apiData.apiPort = process.argv[j + 1];
            break;
        case '--description':
        case '--d':
            exports._apiData.apiDescription = process.argv[j + 1];
            break;
        case '--name':
        case '--n':
            exports._apiData.apiName = process.argv[j + 1];
            break;
        default: break;
    }
}
Bunyan.Log.info('Api name: %s', exports._apiData.apiName);
Bunyan.Log.info('Api description: %s', exports._apiData.apiDescription);
Bunyan.Log.info('Api version: %s', exports._apiData.apiVersion);
Bunyan.Log.info('Api host: %s', exports._apiData.apiHost);
Bunyan.Log.info('Api port: %s', exports._apiData.apiPort);
// #endregion
// Create restify objects
exports.server = restify.createServer({
    name: exports._apiData.apiName,
    versions: exports._apiData.apiSupportedVersions
});
// setUp Cors
const cors = corssMidleware({
    origins: ['*'],
    allowHeaders: ["accept-version" /* ACCEPTVERSION */, "client-authorization" /* CLIENTAUTHORIZATION */, "client-authentication" /* CLIENTAUTHENTICATION */],
    exposeHeaders: []
});
//parsing settings
exports.server.use(restify.plugins.acceptParser(exports.server.acceptable));
exports.server.use(restify.plugins.queryParser({ mapParams: true }));
exports.server.use(restify.plugins.bodyParser({ mapParams: true }));
exports.server.pre(restify.pre.sanitizePath());
exports.server.pre(cors.preflight);
exports.server.pre(cors.actual);
exports.server.pre(function (req, res, next) {
    if (!req.headers["accept-version" /* ACCEPTVERSION */]) {
        Bunyan.Log.info('----> no version sent...updating to 1.0.0');
        req._version = '1.0.0';
        req.headers["accept-version" /* ACCEPTVERSION */] = req._version;
    }
    res.setHeader('Content-Type', 'application/json');
    return next();
});
exports.server.on('restifyError', function (req, res, err, callback) {
    err.toJSON = function customToJSON() {
        return Utility_1.Utility.Messages.sendObjectMessage(404 /* NOT_FOUND */, err.name, err.message);
    };
    err.toString = function customToString() {
        return err.name + ' : ' + err.message;
    };
    return callback();
});
process.on('uncaughtException', function (err) {
    if (err.stack.indexOf('elasticsearch') > 0) {
        console.log('Bunyan log: elasticsearch not running');
        Bunyan.elasticseachDown();
    }
    else
        console.log('Caught exception: ' + err);
});
Bunyan.Log.info('setting routes...');
(new routes_1.Routes()).setRoutes(exports.server);
// #region Server default routes
exports.server.get('/*', restify.plugins.serveStatic({
    directory: './api-docs',
}));
exports.server.get('/', function (req, res, next) {
    res.redirect(exports.server.url.replace('[::]', 'localhost') + '/Swagger', next);
    next();
});
// #endregion
Bunyan.Log.info('setting metrics...');
// #region Server statistics
exports.server.on('after', restify.plugins.metrics({ server: exports.server }, function (err, metrics, req, res, route) {
    Bunyan.Log.info({ method: metrics.method, path: metrics.path, latency: metrics.latency }, 'statistics');
}));
// #endregion
exports.server.listen(exports._apiData.apiPort, function () {
    Bunyan.Log.info('%s listening at %s', exports.server.name, exports.server.url);
});
//# sourceMappingURL=app.js.map
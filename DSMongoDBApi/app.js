"use strict";
/**
 * DSMongoDBApi
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.connections = exports.Log = exports._apiData = exports._logType = exports._logLevel = void 0;
const restify = require("restify");
const restifySwaggerJsdoc = require("restify-swagger-jsdoc");
const Utility_1 = require("./src/utilities/Utility");
const routes_1 = require("./src/api/routes/routes");
const apiData_1 = require("./src/api/common/apiData");
const Bunyan_1 = require("./src/utilities/Bunyan");
const corssMidleware = require('restify-cors-middleware');
exports._logLevel = 'info';
exports._logType = 'c';
// #region apiData
exports._apiData = apiData_1.apiData;
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
        case '--loglevel':
        case '--l':
            exports._logLevel = process.argv[j + 1];
            break;
        case '--logtype':
        case '--g':
            exports._logType = process.argv[j + 1];
            break;
        default: break;
    }
}
// #endregion
// #region Setting logs
exports.Log = new Bunyan_1._Log(exports._logLevel, exports._logType);
;
// #endregion
exports.connections = Utility_1.fileUtility.readFileAsObject('./mongoDatabases.json');
if (exports.connections === undefined || !Array.isArray(exports.connections))
    exports.connections = new Array();
// #region initial logs
exports.Log.info('Api name: %s', exports._apiData.apiName);
exports.Log.info('Api description: %s', exports._apiData.apiDescription);
exports.Log.info('Api version: %s', exports._apiData.apiVersion);
exports.Log.info('Api host: %s', exports._apiData.apiHost);
exports.Log.info('Api port: %s', exports._apiData.apiPort);
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
// parsing settings
exports.server.use(restify.plugins.acceptParser(exports.server.acceptable));
exports.server.use(restify.plugins.queryParser({ mapParams: true }));
exports.server.use(restify.plugins.bodyParser({ mapParams: true }));
exports.server.pre(restify.pre.sanitizePath());
exports.server.pre(cors.preflight);
exports.server.pre(cors.actual);
exports.server.pre(function (req, res, next) {
    if (!req.headers["accept-version" /* ACCEPTVERSION */]) {
        req._version = '1.0.0';
        req.headers["accept-version" /* ACCEPTVERSION */] = req._version;
    }
    res.setHeader('Content-Type', 'application/json');
    return next();
});
exports.server.on('restifyError', function (req, res, err, callback) {
    err.toJSON = function customToJSON() {
        return Utility_1.Messages.sendObjectMessage(404 /* NOT_FOUND */, err.name, err.message);
    };
    err.toString = function customToString() {
        return err.name + ' : ' + err.message;
    };
    return callback();
});
process.on('uncaughtException', function (err) {
    if (err.stack.indexOf('elasticsearch') > 0) {
        exports.Log.elasticDown();
        exports.Log.info('elasticsearch not running');
    }
    else
        console.log('Caught exception: ' + err);
});
exports.Log.info('setting routes...');
(new routes_1.Routes()).setRoutes(exports.server);
// #region swagger
restifySwaggerJsdoc.createSwaggerPage({
    title: exports._apiData.apiName,
    description: exports._apiData.apiDescription,
    version: exports._apiData.apiVersion,
    server: exports.server,
    path: '/swagger',
    apis: ['swagger/swaggerdoc.js']
});
// #endregion
exports.Log.info('setting metrics...');
// #region Server statistics
exports.server.on('after', restify.plugins.metrics({ server: exports.server }, function (err, metrics, req, res, route) {
    exports.Log.info({ method: metrics.method, path: metrics.path, latency: metrics.latency }, 'statistics');
}));
// #endregion
exports.server.listen(exports._apiData.apiPort, function () {
    exports.Log.info('%s listening at %s', exports.server.name, exports.server.url);
});
//# sourceMappingURL=app.js.map
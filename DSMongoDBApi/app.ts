
import path = require('path');

import * as restify from "restify";
import Bunyan = require('./src/utilities/Bunyan');
import { logsStructure } from './src/api/models/logStructures';
import { Utility } from './src/utilities/Utility';
import { AuthClients, AuthClient } from './src/api/models/AuthClients';
import { Routes } from './src/api/routes/routes';
import { apiData } from "./src/api/common/apiData";

const corssMidleware = require('restify-cors-middleware');

export let _apiData = new apiData();

// #region apiData

for (let j = 0; j < process.argv.length; j++) {
    let arg = process.argv[j].toLowerCase();
    switch (arg) {
         case '--host':
        case '--h': _apiData.apiHost = process.argv[j + 1];
            break;
        case '--port':
        case '--p': _apiData.apiPort = process.argv[j + 1];
            break;
        case '--description':
        case '--d': _apiData.apiDescription = process.argv[j + 1];
            break
        case '--name':
        case '--n': _apiData.apiName = process.argv[j + 1];
            break;
        default: break;
    }
}

Bunyan.Log.info('Api name: %s', _apiData.apiName);
Bunyan.Log.info('Api description: %s', _apiData.apiDescription);
Bunyan.Log.info('Api version: %s', _apiData.apiVersion);
Bunyan.Log.info('Api host: %s', _apiData.apiHost);
Bunyan.Log.info('Api port: %s', _apiData.apiPort);

// #endregion

// Create restify objects
export const server = restify.createServer({
    name: _apiData.apiName,
    versions: _apiData.apiSupportedVersions
});

// setUp Cors
const cors = corssMidleware({
    origins: ['*'],
    allowHeaders: [CommonConstants.ACCEPTVERSION, CommonConstants.CLIENTAUTHORIZATION, CommonConstants.CLIENTAUTHENTICATION],
    exposeHeaders: []
})

//parsing settings
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.bodyParser({ mapParams: true }));

server.pre(restify.pre.sanitizePath());

server.pre(cors.preflight);
server.pre(cors.actual);

server.pre(function (req, res, next) {

    if (!req.headers[CommonConstants.ACCEPTVERSION]) {
        Bunyan.Log.info('----> no version sent...updating to 1.0.0');
        req._version = '1.0.0';
        req.headers[CommonConstants.ACCEPTVERSION] = req._version;
    }

    res.setHeader('Content-Type', 'application/json');
    return next();
});

server.on('restifyError', function (req, res, err, callback) {
    err.toJSON = function customToJSON() {
        return Utility.Messages.sendObjectMessage(HTTPStatusCodes.NOT_FOUND, err.name, err.message);
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
    else console.log('Caught exception: ' + err);
});

Bunyan.Log.info('setting routes...');

(new Routes()).setRoutes(server);

// #region Server default routes

server.get('/*', restify.plugins.serveStatic({
    directory: './api-docs',
}));

server.get('/', function (req, res, next) {
    res.redirect(server.url.replace('[::]', 'localhost') + '/Swagger', next);
    next();
});

// #endregion

Bunyan.Log.info('setting metrics...');

// #region Server statistics
server.on('after', restify.plugins.metrics({ server: server },
    function (err, metrics, req, res, route) {
        Bunyan.Log.info({ method: metrics.method, path: metrics.path, latency: metrics.latency }, 'statistics');
    }));
// #endregion

server.listen(_apiData.apiPort, function () {
    Bunyan.Log.info('%s listening at %s', server.name, server.url);
})

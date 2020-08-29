
/**
 * DSMongoDBApi
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */

import path = require('path');

import * as restify from 'restify';
import * as restifySwaggerJsdoc from 'restify-swagger-jsdoc';
import { logsStructure } from './src/api/models/logStructures';
import { Messages, fileUtility } from './src/utilities/Utility';
import { AuthClients, AuthClient } from './src/api/models/AuthClients';
import { Routes } from './src/api/routes/routes';
import { apiData } from "./src/api/common/apiData";
import { Connection } from './src/api/models/Connection';

const corssMidleware = require('restify-cors-middleware');
export let _logLevel = 'info';


// #region apiData

export let _apiData = apiData;

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
        case '--loglevel':
        case '--l': _logLevel = process.argv[j + 1];
            break;
        default: break;
    }
}

// #endregion

// #region Setting logs

// _logLevel = 'error';

import _Log from './src/utilities/Bunyan';

// export let Bunyan = new _Bunyan(_logLevel);
export let Log = _Log;

// #endregion

export let  connections: Array<Connection> = fileUtility.readFileAsObject('./mongoDatabases.json');
if (connections === undefined || !Array.isArray(connections)) connections = new Array<Connection>();

// #region initial logs

Log.info('Api name: %s', _apiData.apiName);
Log.info('Api description: %s', _apiData.apiDescription);
Log.info('Api version: %s', _apiData.apiVersion);
Log.info('Api host: %s', _apiData.apiHost);
Log.info('Api port: %s', _apiData.apiPort);

//Bunyan.Log.info('Api name: %s', _apiData.apiName);
//Bunyan.Log.info('Api description: %s', _apiData.apiDescription);
//Bunyan.Log.info('Api version: %s', _apiData.apiVersion);
//Bunyan.Log.info('Api host: %s', _apiData.apiHost);
//Bunyan.Log.info('Api port: %s', _apiData.apiPort);

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

// parsing settings
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.bodyParser({ mapParams: true }));

server.pre(restify.pre.sanitizePath());

server.pre(cors.preflight);
server.pre(cors.actual);

server.pre(function (req, res, next) {

    if (!req.headers[CommonConstants.ACCEPTVERSION]) {
        req._version = '1.0.0';
        req.headers[CommonConstants.ACCEPTVERSION] = req._version;
    }

    res.setHeader('Content-Type', 'application/json');
    return next();
});

server.on('restifyError', function (req, res, err, callback) {
    err.toJSON = function customToJSON() {
        return Messages.sendObjectMessage(HTTPStatusCodes.NOT_FOUND, err.name, err.message);
    };
    err.toString = function customToString() {
        return err.name + ' : ' + err.message;
    };
    return callback();
});


process.on('uncaughtException', function (err) {
    if (err.stack.indexOf('elasticsearch') > 0) {
        Log.info('elasticsearch not running');
        // Bunyan.elasticseachDown();
    }
    else console.log('Caught exception: ' + err);
});

Log.info('setting routes...');

(new Routes()).setRoutes(server);

// #region swagger

restifySwaggerJsdoc.createSwaggerPage({
    title: _apiData.apiName, // Page title
    description: _apiData.apiDescription,
    version: _apiData.apiVersion, // Server version
    server: server, // Restify server instance created with restify.createServer()
    path: '/swagger', // Public url where the swagger page will be available
    apis: ['swagger/swaggerdoc.js']
    
});

// #endregion

Log.info('setting metrics...');

// #region Server statistics
server.on('after', restify.plugins.metrics({ server: server },
    function (err, metrics, req, res, route) {
        Log.info({ method: metrics.method, path: metrics.path, latency: metrics.latency }, 'statistics');
    }));
// #endregion


server.listen(_apiData.apiPort, function () {
    Log.info('%s listening at %s', server.name, server.url);
})

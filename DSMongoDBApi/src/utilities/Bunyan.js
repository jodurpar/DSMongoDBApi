"use strict";
/**
 * Bunyan log module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
Object.defineProperty(exports, "__esModule", { value: true });
var bunyan = require('bunyan');
const BunyanElasticSearch = require("bunyan-elasticsearch-bulk");
const Utility_1 = require("../utilities/Utility");
const app_1 = require("../../app");
class Bunyan {
    constructor(level) {
        this._version = '1.0';
        this._level = 'info';
        this._level = level;
    }
    get Version() { return this._version; }
    ;
    set Level(value) {
        this._level = value;
        this.create();
    }
    get Level() {
        return this._level;
    }
    get Log() {
        if (!this._log) {
            this.create();
        }
        return this._log;
    }
    ;
    get ElLog() {
        if (!this._elLog) {
            return this._log;
        }
        return this._elLog;
    }
    ;
    elasticseachDown() {
        this._elLog = undefined;
    }
    formattedLog(Bunyanlog, error, type, cat, sub_cat, text_message, ...extendeddata) {
        let message = { type: error, 'cat': cat, 'sub_cat': sub_cat };
        message['extended'] = extendeddata;
        Bunyanlog.info(message, text_message);
    }
    create() {
        this._log = bunyan.createLogger({
            name: app_1._apiData.apiName,
            level: this._level,
            stream: process.stdout,
        });
        this._elLog = bunyan.createLogger({
            name: 'elastic',
            level: this._level,
            stream: BunyanElasticSearch({
                // indexPattern: 'dsmongoapi', // `${_apiData.apiName}`, 
                indexPattern: `[${app_1._apiData.apiName.toLowerCase()}-]YYYY.MM.DD`,
                index: 'dsmongoapi',
                type: 'logs',
                node: 'http://localhost:9200'
            }),
        });
    }
    createLogger(logger) {
        bunyan.createLogger(logger);
    }
    createLoggers(loggers) {
        loggers.forEach(logger => {
            bunyan.createLogger(logger);
        });
    }
    // TODO load bunyan loggers from file
    createLoggersFromFile() {
        let loggers = Utility_1.fileUtility.readFileAsObject('./bunyanloggers.json');
        loggers.forEach(logger => {
        });
    }
}
class _Log {
    constructor(level) {
        this._Bunyan = new Bunyan(level);
    }
    trace(...args) {
        this._Bunyan.Log.trace(...args);
    }
    debug(...args) {
        this._Bunyan.Log.debug(...args);
    }
    info(...args) {
        this._Bunyan.Log.info(...args);
    }
    warn(...args) {
        this._Bunyan.Log.warn(...args);
    }
    error(...args) {
        this._Bunyan.Log.error(...args);
    }
    fatal(...args) {
        this._Bunyan.Log.fatal(...args);
    }
}
exports.default = new _Log(app_1._logLevel);
//# sourceMappingURL=Bunyan.js.map
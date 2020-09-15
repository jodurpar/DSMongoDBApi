"use strict";
/**
 * Bunyan log module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
Object.defineProperty(exports, "__esModule", { value: true });
exports._Log = void 0;
var bunyan = require('bunyan');
const BunyanElasticSearch = require("bunyan-elasticsearch-bulk");
const app_1 = require("../../app");
class DSBunyan {
    constructor(level, type) {
        this._version = '1.0.1';
        this._level = level;
        this._type = type;
        if (type.includes('c')) {
            this.createConsole();
        }
        if (type.includes('e')) {
            this.createElastic();
        }
    }
    get Version() { return this._version; }
    ;
    set Level(value) {
        this._level = value;
        if (this._type.includes('c')) {
            this.createConsole();
        }
        if (this._type.includes('e')) {
            this.createElastic();
        }
    }
    get Level() {
        return this._level;
    }
    get Log() {
        return this._log;
    }
    ;
    get ElLog() {
        return this._elLog;
    }
    ;
    consoleDown() {
        this._log = undefined;
        this._type.replace('c', '');
    }
    consoleUp() {
        this._type = this._type + 'c';
        this.createConsole();
    }
    elasticDown() {
        this._elLog = undefined;
        this._type.replace('e', '');
    }
    elasticUp() {
        this._type = this._type + 'e';
        this.createElastic();
    }
    formattedLog(Bunyanlog, error, type, cat, sub_cat, text_message, ...extendeddata) {
        let message = { type: error, 'cat': cat, 'sub_cat': sub_cat };
        message['extended'] = extendeddata;
        Bunyanlog.info(message, text_message);
    }
    createConsole() {
        this._log = bunyan.createLogger({
            name: app_1._apiData.apiName,
            level: this._level,
            stream: process.stdout,
        });
    }
    createElastic() {
        this._elLog = bunyan.createLogger({
            name: app_1._apiData.apiName,
            level: this._level,
            stream: BunyanElasticSearch({
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
}
class _Log {
    constructor(level, type) {
        this._Bunyan = new DSBunyan(level, type);
    }
    consoleDown() {
        this._Bunyan.consoleDown();
    }
    consoleUp() {
        this._Bunyan.consoleUp();
    }
    elasticDown() {
        this._Bunyan.elasticDown();
    }
    elasticUp() {
        this._Bunyan.elasticUp();
    }
    level(level) {
        this._Bunyan.Level = level;
    }
    trace(...args) {
        if (this._Bunyan.Log) {
            this._Bunyan.Log.trace(...args);
        }
        if (this._Bunyan.ElLog) {
            this._Bunyan.ElLog.trace(...args);
        }
    }
    debug(...args) {
        if (this._Bunyan.Log) {
            this._Bunyan.Log.debug(...args);
        }
        if (this._Bunyan.ElLog) {
            this._Bunyan.ElLog.debug(...args);
        }
    }
    info(...args) {
        if (this._Bunyan.Log) {
            this._Bunyan.Log.info(...args);
        }
        if (this._Bunyan.ElLog) {
            this._Bunyan.ElLog.info(...args);
        }
    }
    warn(...args) {
        if (this._Bunyan.Log) {
            this._Bunyan.Log.warn(...args);
        }
        if (this._Bunyan.ElLog) {
            this._Bunyan.ElLog.warn(...args);
        }
    }
    error(...args) {
        if (this._Bunyan.Log) {
            this._Bunyan.Log.error(...args);
        }
        if (this._Bunyan.ElLog) {
            this._Bunyan.ElLog.error(...args);
        }
    }
    fatal(...args) {
        if (this._Bunyan.Log) {
            this._Bunyan.Log.fatal(...args);
        }
        if (this._Bunyan.ElLog) {
            this._Bunyan.ElLog.fatal(...args);
        }
    }
}
exports._Log = _Log;
//# sourceMappingURL=Bunyan.js.map
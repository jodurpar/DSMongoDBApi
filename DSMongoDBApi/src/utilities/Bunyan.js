"use strict";
/**
 * Bunyan log module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bunyan = void 0;
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
    }
    get Log() {
        if (!this._log) {
            this.createLoggers();
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
    formattedLog(Bunyanlog, error, cat, sub_cat, text_message, ...extendeddata) {
        let message = { 'error': error, 'cat': cat, 'sub_cat': sub_cat };
        message['extended'] = extendeddata;
        Bunyanlog.info(message, text_message);
    }
    createLoggers() {
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
    // TODO load bunyan loggers from file
    createLoggersFromFile() {
        let loggers = Utility_1.fileUtility.readFileAsObject('./bunyanloggers.json');
        loggers.forEach(logger => {
        });
    }
}
exports.Bunyan = Bunyan;
//# sourceMappingURL=Bunyan.js.map
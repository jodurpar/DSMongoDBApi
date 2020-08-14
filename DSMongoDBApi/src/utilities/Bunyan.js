"use strict";
var bunyan = require('bunyan');
const BunyanElasticSearch = require("bunyan-elasticsearch-bulk");
const Utility_1 = require("../utilities/Utility");
const app_1 = require("../../app");
var Utility;
(function (Utility) {
    class Bunyan {
        constructor() {
            this._version = "1.0";
            this._ielLog = new esLog();
        }
        get Version() { return this._version; }
        ;
        set Version(value) {
            if (value != undefined)
                this._version = value;
        }
        get Log() {
            if (!this._log) {
                this.createLoggers();
            }
            return this._log;
        }
        ;
        get ElLog() {
            if (this._elLog != undefined) {
                return this._elLog;
            }
            else {
                return this._ielLog;
            }
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
                level: 'trace',
                stream: process.stdout,
            });
            this._elLog = bunyan.createLogger({
                name: 'elastic',
                level: 'trace',
                stream: BunyanElasticSearch({
                    indexPattern: `${app_1._apiData.apiName}`,
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
    Utility.Bunyan = Bunyan;
    class esLog {
        constructor() {
        }
        info(...args) {
            console.log(args);
        }
    }
})(Utility || (Utility = {}));
module.exports = new Utility.Bunyan();
//# sourceMappingURL=Bunyan.js.map
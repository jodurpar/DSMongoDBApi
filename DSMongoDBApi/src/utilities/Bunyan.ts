/**
 * Bunyan log module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */


var bunyan = require('bunyan');
import BunyanElasticSearch = require('bunyan-elasticsearch-bulk');
import * as restify from 'restify';
import { _apiData, _logLevel, _logType, _statistics } from '../../app';


class DSBunyan {
    private _version: string = '1.0.1';
    private _level: string;
    private _type: string;
    private _log: any;
    private _elLog: any;



    constructor(level: string, type: string) {
        this._level = level;
        this._type = type;
        if (type.includes('c')) {
            this.createConsole();
        }
        if (type.includes('e')) {
            this.createElastic();
        }
    }

    public get Version(): string { return this._version; };
    public set Level(value: string) {
        this._level = value;
        if (this._type.includes('c')) {
            this.createConsole();
        }
        if (this._type.includes('e')) {
            this.createElastic();
        }
    }

    public get Level(): string {
        return this._level;
    }

    public get Log(): any {
        return this._log
    };

    public get ElLog(): any {
        return this._elLog;
    };

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

    formattedLog(Bunyanlog: any, error: HTTPStatusCodes, type: string, cat: string, sub_cat: string, text_message: string, ...extendeddata) {
        let message = { type: error, 'cat': cat, 'sub_cat': sub_cat }
        message['extended'] = extendeddata;
        Bunyanlog.info(message, text_message);
    }

    createConsole() {
        this._log = bunyan.createLogger({
            name: _apiData.apiName,
            level: this._level,      // Optional, trace, debug, info, warn, error, fatal
            stream: process.stdout,           // Optional, see "Streams" section
        });
    }

    createElastic() {
        this._elLog = bunyan.createLogger({
            name: _apiData.apiName,
            level: this._level,      // Optional, trace, debug, info, warn, error, fatal
            stream: BunyanElasticSearch({
                indexPattern: `[${_apiData.apiName.toLowerCase()}-]YYYY.MM.DD`,
                index: 'dsmongoapi',
                type: 'logs',
                node: 'http://localhost:9200'
            }),
        });
    }

    createLogger(logger) {
        bunyan.createLogger(logger);
    }

    createLoggers(loggers: []) {
        loggers.forEach(logger => {
            bunyan.createLogger(logger);
        })
    }

}

export class _Log {
    _Bunyan: DSBunyan;
    _Server: any;

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

    // #region Server statistics

    setBunyanServer(server: any) {
        this._Server = server;
    }

    statisticsUp() {
        let _self = this;
        this._Server.on('after', restify.plugins.metrics({ server: this._Server },
            function (err, metrics, req, res, route) {
                _self.info({ method: metrics.method, path: metrics.path, latency: metrics.latency }, 'statistics');
            }));

    }

    // #endregion


    public trace(...args) {
        this.writeLog('trace', ...args);
    }
    public debug(...args) {
        this.writeLog('debug', ...args);
    }
    public info(...args) {
        this.writeLog('info', ...args);
    }
    public warn(...args) {
        this.writeLog('warn', ...args);
    }
    public error(...args) {
        this.writeLog('error', ...args);
    }
    public fatal(...args) {
        this.writeLog('fatal', ...args);
    }

    public writeLog(type: string, ...args) {
        if (this._Bunyan.Log) {
            this._Bunyan.Log[type](...args);
        }
        if (this._Bunyan.ElLog) {
            this._Bunyan.ElLog[type](...args);
        }
    }

    public writeFormatedLog(type, cat: string, sub_cat: string, error: HTTPStatusCodes, text_message, ...extendeddata) {
        if (this._Bunyan.Log) {
            this._Bunyan.formattedLog(this._Bunyan.Log, error, type, cat, sub_cat, text_message, ...extendeddata);
        }
    }

}



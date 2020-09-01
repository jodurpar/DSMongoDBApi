/**
 * Bunyan log module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */


var bunyan = require('bunyan');
import BunyanElasticSearch = require('bunyan-elasticsearch-bulk');
import { fileUtility, stringsUtility } from '../utilities/Utility';
import { _apiData, _logLevel } from '../../app';


    class Bunyan {
        private _version: string = '1.0';
        private _level: string = 'info';
        private _log: any;
        private _elLog: any;


        constructor(level: string) {
            this._level = level;
        }

        public get Version(): string { return this._version; };
        public set Level(value: string) {
            this._level = value;
            this.create();
        }

        public get Level(): string {
            return this._level;
        }

        public get Log(): any {
            if (!this._log) {
                this.create();
            }
            return this._log
        };
        public get ElLog(): any {
            if (!this._elLog ) { return this._log }
            return this._elLog;
        };

        elasticseachDown() {
            this._elLog = undefined;
        }

        formattedLog(Bunyanlog: any, error: HTTPStatusCodes, type: string,  cat: string, sub_cat: string, text_message: string, ...extendeddata) {
            let message = { type: error, 'cat': cat, 'sub_cat': sub_cat } 
            message['extended'] = extendeddata;
            Bunyanlog.info(message,text_message);
        }


        create() {
            this._log = bunyan.createLogger({
                name: _apiData.apiName,                     
                level: this._level,      // Optional, 'trace', debug, info, warn, error, fatal
                stream: process.stdout,           // Optional, see "Streams" section
            });
            this._elLog = bunyan.createLogger({
                name: 'elastic',                     
                level: this._level,      // Optional, 'trace', debug, info, warn, error, fatal
                stream: BunyanElasticSearch({
                    // indexPattern: 'dsmongoapi', // `${_apiData.apiName}`, 
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

        // TODO load bunyan loggers from file
        createLoggersFromFile() {
            let loggers : [] = fileUtility.readFileAsObject('./bunyanloggers.json');
            loggers.forEach(logger => {

            })
        }

}

class _Log {
    _Bunyan : Bunyan;

    constructor(level) {
        this._Bunyan = new Bunyan(level);
    }
    public trace(...args) {
        this._Bunyan.Log.trace(...args);
    }
    public debug(...args) {
        this._Bunyan.Log.debug(...args);
    }

    public info(...args) {
        this._Bunyan.Log.info(...args);
    }
    public warn(...args) {
        this._Bunyan.Log.warn(...args);
    }

    public error(...args) {
        this._Bunyan.Log.error(...args);
    }
    public fatal(...args) {
        this._Bunyan.Log.fatal(...args);
    }

}

export default new _Log(_logLevel);
 
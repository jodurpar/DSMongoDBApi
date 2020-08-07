
var bunyan = require('bunyan');
import BunyanElasticSearch = require('bunyan-elasticsearch-bulk');
import { Utility as Util } from '../utilities/Utility';
import { _apiData } from '../../app';

namespace Utility {
    export class Bunyan {
        private _version: string;
        private _log: any;
        private _elLog: any;
        private _ielLog: any;

        public get Version(): string { return this._version; };
        public set Version(value: string) {
            if (value != undefined) this._version = value;
        }

        

        public get Log(): any {
            if (!this._log) {
                this.createLoggers();
            }
            return this._log
        };
        public get ElLog(): any {
            if (this._elLog != undefined) { return this._elLog }
            else { return this._ielLog; }
        };
 
        

        constructor() {
            this._version = "1.0";
            this._ielLog = new esLog();
        }

        elasticseachDown() {
            this._elLog = undefined;
        }

        formattedLog(Bunyanlog: any, error: HTTPStatusCodes, cat: string, sub_cat: string, text_message: string, ...extendeddata) {
            let message = { 'error': error, 'cat': cat, 'sub_cat': sub_cat } 
            message['extended'] = extendeddata;
            Bunyanlog.info(message,text_message);
        }


        createLoggers() {
            this._log = bunyan.createLogger({
                name: _apiData.apiName,                     
                level: 'trace',      // Optional, 'trace', debug, info, warn, error, fatal
                stream: process.stdout,           // Optional, see "Streams" section
            });
            this._elLog = bunyan.createLogger({
                name: 'elastic',                     
                level: 'trace',      // Optional, 'trace', debug, info, warn, error, fatal
                stream: BunyanElasticSearch({
                    indexPattern: `${_apiData.apiName}`, 
                    type: 'logs',
                    node: 'http://localhost:9200'
                }),
            });

        }

        // TODO load bunyan loggers from file
        createLoggersFromFile() {
            let loggers : [] = Util.fileUtility.readFileAsObject('./bunyanloggers.json');
            loggers.forEach(logger => {

            })
        }
    }

    class esLog
    {
        constructor() {
        
        }

        info(...args) {
            console.log(args);
        }

    }
 }

 export = new Utility.Bunyan();
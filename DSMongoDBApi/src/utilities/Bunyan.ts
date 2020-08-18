/**
 * Bunyan log module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */


var bunyan = require('bunyan');
import BunyanElasticSearch = require('bunyan-elasticsearch-bulk');
import { fileUtility } from '../utilities/Utility';
import { _apiData } from '../../app';

    export class Bunyan {
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
        }


        public get Log(): any {
            if (!this._log) {
                this.createLoggers();
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

        formattedLog(Bunyanlog: any, error: HTTPStatusCodes, cat: string, sub_cat: string, text_message: string, ...extendeddata) {
            let message = { 'error': error, 'cat': cat, 'sub_cat': sub_cat } 
            message['extended'] = extendeddata;
            Bunyanlog.info(message,text_message);
        }


        createLoggers() {
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

        // TODO load bunyan loggers from file
        createLoggersFromFile() {
            let loggers : [] = fileUtility.readFileAsObject('./bunyanloggers.json');
            loggers.forEach(logger => {

            })
        }
    }

 
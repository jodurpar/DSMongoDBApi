"use strict";
/******************************************************************
 * 24/07/2020 - Jose Dur�n Pareja
 *
 * Contains api basic data
 * V0.0.0 - First version
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiData = void 0;
class apiData {
    constructor() {
        this._apiName = 'dsExampleApi';
        this._apiVersion = '0.0.1';
        this._apiSupportedVersions = ['1.0.0'];
        this._apiHost = 'localhost';
        this._apiPort = '51234';
        this._apiDescription = 'RESTful API with Restify, MongoDb, Swagger and Bunyan logs with Elastic';
    }
    get apiName() {
        return this._apiName;
    }
    set apiName(value) {
        this._apiName = value;
    }
    get apiVersion() {
        return this._apiVersion;
    }
    set apiVersion(value) {
        this._apiVersion = value;
    }
    get apiSupportedVersions() {
        return this._apiSupportedVersions;
    }
    set apiSupportedVersions(value) {
        this._apiSupportedVersions = value;
    }
    get apiHost() {
        return this._apiHost;
    }
    set apiHost(value) {
        this._apiHost = value;
    }
    get apiPort() {
        return this._apiPort;
    }
    set apiPort(value) {
        this._apiPort = value;
    }
    get apiDescription() {
        return this._apiDescription;
    }
    set apiDescription(value) {
        this._apiDescription = value;
    }
}
exports.apiData = apiData;

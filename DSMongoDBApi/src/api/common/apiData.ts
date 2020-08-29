/******************************************************************
 * 24/07/2020 - Jose Durán Pareja
 * 
 * Contains api basic data
 * V1.0.0 - First version
 */


class _apiData {
    
    private _apiName : string = 'dsMongoDBApi';
    private _apiVersion : string = '1.0.0';
    private _apiSupportedVersions : [string] = ['1.0.0'];
    private _apiHost : string = 'localhost';
    private _apiPort : string = '51234';
    private _apiDescription: string = 'RESTful API with Restify, MongoDb, Swagger and Bunyan logs with Elastic';

    get apiName() : string {
            return this._apiName;
    }
    set apiName(value: string) {
        this._apiName = value;
    }
    get apiVersion(): string {
        return this._apiVersion;
    }
    set apiVersion(value: string) {
        this._apiVersion = value;
    }

    get apiSupportedVersions(): [string] {
        return this._apiSupportedVersions;
    }
    set apiSupportedVersions(value: [string]) {
        this._apiSupportedVersions = value;
    }

    get apiHost() : string {
        return this._apiHost;
    }
    set apiHost(value: string) {
        this._apiHost = value;
    }

    get apiPort(): string {
        return this._apiPort;
    }
    set apiPort(value: string) {
        this._apiPort = value;
    }

    get apiDescription(): string {
        return this._apiDescription;
    }
    set apiDescription(value: string) {
        this._apiDescription = value;
    }

}

export let apiData = new _apiData();


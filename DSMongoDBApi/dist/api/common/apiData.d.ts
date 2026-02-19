/******************************************************************
 * 24/07/2020 - Jose Dur�n Pareja
 *
 * Contains api basic data
 * V1.0.0 - First version
 */
declare class _apiData {
    private _apiName;
    private _apiVersion;
    private _apiSupportedVersions;
    private _apiHost;
    private _apiPort;
    private _apiDescription;
    get apiName(): string;
    set apiName(value: string);
    get apiVersion(): string;
    set apiVersion(value: string);
    get apiSupportedVersions(): [string];
    set apiSupportedVersions(value: [string]);
    get apiHost(): string;
    set apiHost(value: string);
    get apiPort(): string;
    set apiPort(value: string);
    get apiDescription(): string;
    set apiDescription(value: string);
}
export declare let apiData: _apiData;
export {};
//# sourceMappingURL=apiData.d.ts.map
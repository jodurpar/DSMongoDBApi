/**
 * Bunyan log module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
declare class DSBunyan {
    private _version;
    private _level;
    private _type;
    private _log;
    private _elLog;
    constructor(level: string, type: string);
    get Version(): string;
    set Level(value: string);
    get Level(): string;
    get Log(): any;
    get ElLog(): any;
    consoleDown(): void;
    consoleUp(): void;
    elasticDown(): void;
    elasticUp(): void;
    formattedLog(Bunyanlog: any, error: HTTPStatusCodes, type: string, cat: string, sub_cat: string, text_message: string, ...extendeddata: any[]): void;
    createConsole(): void;
    createElastic(): void;
    createLogger(logger: any): void;
    createLoggers(loggers: []): void;
}
export declare class _Log {
    _Bunyan: DSBunyan;
    _Server: any;
    constructor(level: any, type: any);
    consoleDown(): void;
    consoleUp(): void;
    elasticDown(): void;
    elasticUp(): void;
    level(level: any): void;
    setBunyanServer(server: any): void;
    statisticsUp(): void;
    trace(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    fatal(...args: any[]): void;
    writeLog(type: string, ...args: any[]): void;
    writeFormatedLog(type: any, cat: string, sub_cat: string, error: HTTPStatusCodes, text_message: any, ...extendeddata: any[]): void;
}
export {};
//# sourceMappingURL=Bunyan.d.ts.map
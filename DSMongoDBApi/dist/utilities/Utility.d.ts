/**
 * Utility class module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
import { restify } from 'restify';
import { messageObject } from '../api/models/messageObject';
export declare class version {
    private _version;
    get Version(): string;
    set Version(value: string);
}
export declare class Messages extends version {
    static sendMessage(_responseCode: any, _status: any, _message: any): string;
    static sendMessageAsync(_responseCode: any, _status: any, _message: any): Promise<string>;
    static sendObjectMessage(_responseCode: any, _status: any, _message: any): messageObject;
    static sendObjectMessageAsync(_responseCode: any, _status: any, _message: any): Promise<messageObject>;
}
export declare class params extends version {
    static assign(req: restify.request): [string, string, object, object, object];
}
export declare class status extends version {
    static getStatusFromMessage(message: string): HTTPStatusCodes;
}
export declare class method extends version {
    static getMethodName(_self: any): string;
}
export declare class stringsUtility extends version {
    static format(...args: any[]): string;
}
export declare class fileUtility extends version {
    static readFileAsString(fileName: string): string;
    static readFileAsObject(fileName: string): any;
}
//# sourceMappingURL=Utility.d.ts.map
/**
 * Common execute class module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
import { version } from '../../utilities/Utility';
export declare class Common extends version {
    static executeFunctionByName(functionName: any, context: any, req: any, res: any): any;
    static executeFunctionByNameAsync(functionName: any, context: any, req: any, res: any): Promise<any>;
    static createClassByName(functionName: any, context: any): any;
    static getPropertyByName(functionName: any, context: any): any;
    static getApiVersion(req: any): string;
    static executeSync(req: any, res: any, next: any, classRoute: any, apiRoute: any): void;
    static executeAsync(req: any, res: any, next: any, classRoute: any, apiRoute: any): Promise<void>;
}
//# sourceMappingURL=Common.d.ts.map
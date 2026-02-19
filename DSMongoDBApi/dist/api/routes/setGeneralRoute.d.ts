/**
 * Utilities for routes module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
export declare class setGeneralRoute {
    constructor();
    static Set(server: any, verb: string, route: string, asyncRoute: string, params: string, pathName: string, className: string, methodName: string): Promise<void>;
    private static SetSync;
    static SetAsync(server: any, verb: string, route: string, params: string, pathName: string, className: string, methodName: string): Promise<void>;
}
//# sourceMappingURL=setGeneralRoute.d.ts.map
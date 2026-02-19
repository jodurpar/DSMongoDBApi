/**
 * Routes module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
import { version } from '../../utilities/Utility';
export declare class Routes extends version implements IRoutes {
    private _statistics;
    get Statistics(): boolean;
    set Statistics(value: boolean);
    setRoutes(server: any): Promise<void>;
}
//# sourceMappingURL=routes.d.ts.map
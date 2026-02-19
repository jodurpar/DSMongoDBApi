import { restify } from 'restify';
import { version } from '../../../utilities/Utility';
export declare namespace api100 {
    class swagger extends version {
        static swaggerDefinition: {
            info: {
                title: string;
                version: string;
                description: string;
            };
            host: string;
            basePath: string;
        };
        static options: {
            swaggerDefinition: {
                info: {
                    title: string;
                    version: string;
                    description: string;
                };
                host: string;
                basePath: string;
            };
            apis: string[];
        };
        static swaggerSpec: any;
        static get SwaggerSpec(): any;
        readSwagger(req: restify.request, res: restify.response): void;
        swagger(req: restify.request, res: restify.response): void;
    }
}
//# sourceMappingURL=swagger.d.ts.map
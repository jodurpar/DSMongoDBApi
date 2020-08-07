"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api100 = void 0;
const fs = require("fs");
const Utility_1 = require("../../../utilities/Utility");
const app_1 = require("../../../../app");
const swaggerJSDoc = require('swagger-jsdoc');
var api100;
(function (api100) {
    class swagger extends Utility_1.Utility.version {
        static get SwaggerSpec() { return swagger.swaggerSpec; }
        readSwagger(req, res) {
            res.send(swagger.swaggerSpec);
        }
        swagger(req, res) {
            const fileContent = fs.readFileSync('./api-docs/index.html', 'utf8').replace('{{host}}', swagger.swaggerDefinition.host);
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(fileContent),
                'Content-Type': 'text/html'
            });
            res.write(fileContent);
            res.end();
        }
    }
    // Swagger init
    // swagger definition
    swagger.swaggerDefinition = {
        info: {
            title: app_1._apiData.apiName,
            version: app_1._apiData.apiVersion,
            description: app_1._apiData.apiDescription
        },
        host: app_1._apiData.apiHost + ':' + app_1._apiData.apiPort,
        basePath: '/',
    };
    // options for the swagger docs
    swagger.options = {
        // import swaggerDefinitions
        swaggerDefinition: swagger.swaggerDefinition,
        // path to the API docs
        apis: ['./api-docs/swaggerdoc.js'] // pass all in array,
    };
    // initialize swagger-jsdoc
    swagger.swaggerSpec = swaggerJSDoc(swagger.options);
    api100.swagger = swagger;
})(api100 = exports.api100 || (exports.api100 = {}));
//# sourceMappingURL=swagger.js.map
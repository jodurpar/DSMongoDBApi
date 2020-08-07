import { restify } from 'restify';
import * as fs from 'fs';

import { Utility } from '../../../utilities/Utility';
import { _apiData } from '../../../../app';


const swaggerJSDoc = require('swagger-jsdoc');

export namespace api100 {

	export class swagger extends Utility.version {

		// Swagger init
		// swagger definition
		static swaggerDefinition = {
			info: {
				title: _apiData.apiName,
				version: _apiData.apiVersion,
				description: _apiData.apiDescription
			},
			host: _apiData.apiHost + ':' + _apiData.apiPort,
			basePath: '/',
		};
		// options for the swagger docs
		static options = {
			// import swaggerDefinitions
			swaggerDefinition: swagger.swaggerDefinition,
			// path to the API docs
			apis: ['./api-docs/swaggerdoc.js'] // pass all in array,
		};
		// initialize swagger-jsdoc
		static swaggerSpec = swaggerJSDoc(swagger.options);

        public static get SwaggerSpec() { return swagger.swaggerSpec; }

        public readSwagger(req: restify.request, res: restify.response) {
            res.send(swagger.swaggerSpec);
        }

        public swagger(req: restify.request, res: restify.response) {
			
			const fileContent = fs.readFileSync('./api-docs/index.html', 'utf8').replace('{{host}}',swagger.swaggerDefinition.host);
            res.writeHead(200, {
				'Content-Length': Buffer.byteLength(fileContent),
                'Content-Type': 'text/html'
            });
            res.write(fileContent);
            res.end();
        }

    }
}


import { restify } from 'restify';
import * as fs from 'fs';
import { messageObject } from '../api/models/messageObject';

// export namespace Utility {

    export class version {
        private _version: string;
        private _currentMethod: string;


        constructor() {
            this._version = "1.0";
        }

        public get Version(): string { return this._version; }
        public set Version(value: string) {
            if (value != undefined) this._version = value;
        }

    }

    export class Messages extends version {

        public static sendMessage(_responseCode, _status, _message): string {
            return JSON.stringify(new messageObject(_responseCode, _status, _message));
        };


        public static sendMessageAsync(_responseCode, _status, _message): Promise<string> {
            return new Promise<string>(async (resolve, reject) => {
                resolve(JSON.stringify(new messageObject(_responseCode, _status, _message)));
            });
        }

        public static sendObjectMessage(_responseCode, _status, _message): messageObject {
            return new messageObject(_responseCode, _status, _message);
        }

        public static sendObjectMessageAsync(_responseCode, _status, _message): Promise<messageObject> {
            return new Promise<messageObject>(async (resolve, reject) => {
                resolve(new messageObject(_responseCode, _status, _message));
            })
        }

    }

    export class params extends version {

        public static assign(req: restify.request): [string, string, object, object, object] {
            let database: string;
            let collection: string;
            let filter: any;
            let data: any;
            let options: any;

            try {

				if (req.body !== undefined) {
                    database = req.body.connection !== undefined ? req.body.connection : req.body.database;
					collection = req.body.collection;
                    data = req.body.data;
                    filter = req.body.filter;
                    options = req.body.options;
                }


                if ((req.params.database !== undefined) && (req.params.collection !== undefined)) {
                    database = req.params.connection !== undefined ? req.params.connection : req.params.database;
                    collection = req.params.collection;
					data = req.body;
                    filter = req.params.filter;
                    options = req.params.options;
                }

            }
            catch (e) {
                console.log(e.message)
            }

            return [database, collection, filter === undefined || (typeof filter) === "object" ? filter : JSON.parse(filter), data, options];
        }
    }

    export class status extends version {

		public static getStatusFromMessage(message: string): HTTPStatusCodes {
			if (typeof message == 'string') {
				if ((message.indexOf(CommonConstants.NOTFOUND) != -1) || (message.indexOf('failed to connect') != -1)) {
					return HTTPStatusCodes.NOT_FOUND;
				}
				else return HTTPStatusCodes.INTERNAL_SERVER_ERROR;
			}
			else return HTTPStatusCodes.INTERNAL_SERVER_ERROR;
        }

    }

    export class method extends version {

        public static getMethodName(_self: any): string {
            return _self._currentMethod + CommonConstants.PARENTHESES;
        }

    }

    export class stringsUtility extends version {
        public static format(...args): string {

            var theString = args[0];

            for (var i = 1; i < args.length; i++) {
                var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                theString = theString.replace(regEx, args[i]);
            }
            return theString;
        }
    }

    export class fileUtility extends version {

        public static readFileAsString(fileName: string) {
            try {
                return (fs.readFileSync(fileName, 'utf8'));
            }
            catch {
                return '';
            }
        }

        public static readFileAsObject(fileName: string) {
            try {
                return (JSON.parse(fs.readFileSync(fileName, 'utf8').replace(/\r\n/g, '').replace(/\n/g, '').trim()));
            }
            catch (error) {
                console.log('**' + error)
                return {};
            }
        }
    }

// }

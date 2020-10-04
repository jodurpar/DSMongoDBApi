"use strict";
/**
 * Utility class module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUtility = exports.stringsUtility = exports.method = exports.status = exports.params = exports.Messages = exports.version = void 0;
const fs = require("fs");
const messageObject_1 = require("../api/models/messageObject");
const app_1 = require("./../../app");
class version {
    constructor() {
        this._version = '1.0.0';
    }
    //     private _currentMethod: string;
    get Version() { return this._version; }
    set Version(value) {
        if (value != undefined)
            this._version = value;
    }
}
exports.version = version;
class Messages extends version {
    static sendMessage(_responseCode, _status, _message) {
        return JSON.stringify(new messageObject_1.messageObject(_responseCode, _status, _message));
    }
    ;
    static sendMessageAsync(_responseCode, _status, _message) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            resolve(JSON.stringify(new messageObject_1.messageObject(_responseCode, _status, _message)));
        }));
    }
    static sendObjectMessage(_responseCode, _status, _message) {
        return new messageObject_1.messageObject(_responseCode, _status, _message);
    }
    static sendObjectMessageAsync(_responseCode, _status, _message) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            resolve(new messageObject_1.messageObject(_responseCode, _status, _message));
        }));
    }
}
exports.Messages = Messages;
class params extends version {
    static assign(req) {
        let database;
        let collection;
        let filter;
        let data;
        let options;
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
        catch (error) {
            app_1.Log.error(`Params assign, ${error.message}`);
        }
        return [database, collection, filter === undefined || (typeof filter) === "object" ? filter : JSON.parse(filter), data, options];
    }
}
exports.params = params;
class status extends version {
    static getStatusFromMessage(message) {
        if (typeof message == 'string') {
            if ((message.indexOf("not found" /* NOTFOUND */) != -1) || (message.indexOf('failed to connect') != -1)) {
                return 404 /* NOT_FOUND */;
            }
            else
                return 500 /* INTERNAL_SERVER_ERROR */;
        }
        else
            return 500 /* INTERNAL_SERVER_ERROR */;
    }
}
exports.status = status;
class method extends version {
    static getMethodName(_self) {
        return _self._currentMethod + "()" /* PARENTHESES */;
    }
}
exports.method = method;
class stringsUtility extends version {
    static format(...args) {
        var theString = args[0];
        for (var i = 1; i < args.length; i++) {
            var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            theString = theString.replace(regEx, args[i]);
        }
        return theString;
    }
}
exports.stringsUtility = stringsUtility;
class fileUtility extends version {
    static readFileAsString(fileName) {
        try {
            return (fs.readFileSync(fileName, 'utf8'));
        }
        catch (error) {
            app_1.Log.error(`Can't read file, ${error}`);
            return '';
        }
    }
    static readFileAsObject(fileName) {
        try {
            return (JSON.parse(fs.readFileSync(fileName, 'utf8').replace(/\r\n/g, '').replace(/\n/g, '').trim()));
        }
        catch (error) {
            app_1.Log.error(`Can't read file, ${error}`);
            return {};
        }
    }
}
exports.fileUtility = fileUtility;

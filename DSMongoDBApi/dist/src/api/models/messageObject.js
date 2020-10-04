"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageObject = void 0;
class messageObject {
    constructor(responseCode, status, data) {
        this.responseCode = responseCode;
        this.status = status;
        this.data = data;
    }
}
exports.messageObject = messageObject;

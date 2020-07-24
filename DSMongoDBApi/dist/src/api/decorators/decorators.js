"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMethodName = exports.Authorization = void 0;
function Authorization(target) {
    target["Authenticated"] = true;
}
exports.Authorization = Authorization;
function getMethodName(target, name, desc) {
    var method = desc.value;
    desc.value = function () {
        this._currentMethod = name;
        method.apply(this, arguments);
    };
}
exports.getMethodName = getMethodName;

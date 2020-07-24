"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.api100 = void 0;
const Utility_1 = require("../../../utilities/Utility");
const decorators_1 = require("../../decorators/decorators");
var api100;
(function (api100) {
    let Messages = class Messages extends Utility_1.Utility.version {
        TestMessages(req, res) {
            let _message = req.params.message != undefined ? req.params.message : req.body.message;
            res.send(200 /* OK */, Utility_1.Utility.Messages.sendObjectMessage(200 /* OK */, "Ok" /* OK */, Utility_1.Utility.stringsUtility.format('{0}{1} {2} {3}{4} {5}', Utility_1.Utility.method.getMethodName(this), ":" /* TWOPOINTS */, this.Version, "Recieved" /* RECIEVED */, ":" /* TWOPOINTS */, _message)));
        }
        TestMessagesAsync(req, res) {
            let _self = this;
            let _message = req.params.message != undefined ? req.params.message : req.body.message;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    res.send(200 /* OK */, Utility_1.Utility.Messages.sendObjectMessage(200 /* OK */, "Ok" /* OK */, Utility_1.Utility.stringsUtility.format('{0}{1} {2} {3}{4} {5}', Utility_1.Utility.method.getMethodName(_self), ":" /* TWOPOINTS */, this.Version, "Recieved" /* RECIEVED */, ":" /* TWOPOINTS */, _message)));
                    resolve(yield Utility_1.Utility.Messages.sendObjectMessageAsync(200 /* OK */, "Ok" /* OK */, Utility_1.Utility.stringsUtility.format('{0} {1} {2}{3} {4}', Utility_1.Utility.method.getMethodName(_self), this.Version, "Recieved" /* RECIEVED */, ":" /* TWOPOINTS */, _message)));
                }
                catch (error) {
                    reject(yield Utility_1.Utility.Messages.sendObjectMessageAsync(500 /* INTERNAL_SERVER_ERROR */, error, Utility_1.Utility.method.getMethodName(_self) + ' ' + this.Version));
                }
            }));
        }
    };
    __decorate([
        decorators_1.getMethodName
    ], Messages.prototype, "TestMessages", null);
    __decorate([
        decorators_1.getMethodName
    ], Messages.prototype, "TestMessagesAsync", null);
    Messages = __decorate([
        decorators_1.Authorization
    ], Messages);
    api100.Messages = Messages;
})(api100 = exports.api100 || (exports.api100 = {}));

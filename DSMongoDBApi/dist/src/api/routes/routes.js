"use strict";
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
exports.Routes = void 0;
const Banyan = require("../../utilities/Bunyan");
const Utility_1 = require("../../utilities/Utility");
const setGeneralRoute_1 = require("./setGeneralRoute");
class Routes extends Utility_1.Utility.version {
    get Statistics() { return this._statistics; }
    set Statistics(value) {
        if (value !== undefined)
            this._statistics = value;
    }
    setRoutes(server) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // #region controllers
                setGeneralRoute_1.setGeneralRoute.Set(server, 'get', '/TestMessages', '/TestMessagesAsync', '/:message', '/messages', 'Messages', 'TestMessages').then(result => { }).catch(e => { });
                setGeneralRoute_1.setGeneralRoute.Set(server, 'get', '/Health', '/HealthAsync', '', '/health', 'Health', 'Health').then(result => { }).catch(e => { });
                setGeneralRoute_1.setGeneralRoute.Set(server, 'get', '/Collections/Drop', '/CollectionsAsync/Drop', '', '/collections/drop', 'collections', 'dropCollection').then(result => { }).catch(e => { });
                setGeneralRoute_1.setGeneralRoute.Set(server, 'get', '/Connections/Add', '/ConnectionsAsync/Add', '', '/connections/add', 'connections', 'addConnection').then(result => { }).catch(e => { });
                setGeneralRoute_1.setGeneralRoute.Set(server, 'get', '/Documents', '/DocumentsAsync', '', '/documents/get', 'Documents', 'GetDocuments').then(result => { }).catch(e => { });
                setGeneralRoute_1.setGeneralRoute.Set(server, 'put', '/Documents', '/DocumentsAsync', '', '/documents/put', 'Documents', 'PutDocuments').then(result => { }).catch(e => { });
                setGeneralRoute_1.setGeneralRoute.Set(server, 'put', '/Documents', '/DocumentsAsync', '/:database/:collection', '/Documents/put', 'Documents', 'PutDocuments').then(result => { }).catch(e => { });
                setGeneralRoute_1.setGeneralRoute.Set(server, 'patch', '/Documents', '/DocumentsAsync', '', '/documents/patch', 'Documents', 'PatchDocuments').then(result => { }).catch(e => { });
                setGeneralRoute_1.setGeneralRoute.Set(server, 'patch', '/Documents', '/DocumentsAsync', '/:database/:collection', '/Documents/patch', 'Documents', 'PatchDocuments').then(result => { }).catch(e => { });
                setGeneralRoute_1.setGeneralRoute.Set(server, 'del', '/Documents', '/DocumentsAsync', '', '/documents/delete', 'Documents', 'DeleteDocuments').then(result => { }).catch(e => { });
                setGeneralRoute_1.setGeneralRoute.Set(server, 'del', '/Documents', '/DocumentsAsync', '/:database/:collection', '/Documents/delete', 'Documents', 'DeleteDocuments').then(result => { }).catch(e => { });
                // #endregion
                // #region swagger
                setGeneralRoute_1.setGeneralRoute.Set(server, 'get', '/Swagger', undefined, '', '/swagger', 'swagger', 'swagger').then(result => { }).catch(e => { });
                ;
                setGeneralRoute_1.setGeneralRoute.Set(server, 'get', '/ReadSwagger', undefined, '', '/swagger', 'swagger', 'readSwagger').then(result => { }).catch(e => { });
                ;
                // #endregion
                Banyan.Log.info('Registered');
                return;
            }
            catch (e) {
                Banyan.Log.error(Utility_1.Utility.Messages.sendMessage(500 /* INTERNAL_SERVER_ERROR */, e.message, "Unable to execute SetRoutes."));
                return;
            }
        });
    }
}
exports.Routes = Routes;

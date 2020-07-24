
import Banyan = require('../../utilities/Bunyan');
import { Utility } from '../../utilities/Utility';

import { setGeneralRoute } from './setGeneralRoute';

export class Routes extends Utility.version implements IRoutes {

    private _statistics: boolean;

    public get Statistics(): boolean { return this._statistics; }
    public set Statistics(value: boolean) {
        if (value !== undefined) this._statistics = value;
    }

    public async setRoutes(server) {

        try {

            // #region controllers

			setGeneralRoute.Set(server, 'get', '/TestMessages', '/TestMessagesAsync', '/:message', '/messages', 'Messages', 'TestMessages').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'get', '/Health', '/HealthAsync', '', '/health', 'Health', 'Health').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'get', '/Collections/Drop', '/CollectionsAsync/Drop', '', '/collections/drop', 'collections', 'dropCollection').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'get', '/Connections/Add', '/ConnectionsAsync/Add', '', '/connections/add', 'connections', 'addConnection').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'get', '/Documents', '/DocumentsAsync', '', '/documents/get', 'Documents', 'GetDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'put', '/Documents', '/DocumentsAsync', '', '/documents/put', 'Documents', 'PutDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'put', '/Documents', '/DocumentsAsync', '/:database/:collection', '/Documents/put', 'Documents', 'PutDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'patch', '/Documents', '/DocumentsAsync', '', '/documents/patch', 'Documents', 'PatchDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'patch', '/Documents', '/DocumentsAsync', '/:database/:collection', '/Documents/patch', 'Documents', 'PatchDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'del', '/Documents', '/DocumentsAsync', '', '/documents/delete', 'Documents', 'DeleteDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'del', '/Documents', '/DocumentsAsync', '/:database/:collection', '/Documents/delete', 'Documents', 'DeleteDocuments').then(result => { }).catch(e => { });

            // #endregion

            // #region swagger

			setGeneralRoute.Set(server, 'get', '/Swagger', undefined, '', '/swagger', 'swagger', 'swagger').then(result => { }).catch(e => { });;
			setGeneralRoute.Set(server, 'get', '/ReadSwagger', undefined, '', '/swagger', 'swagger', 'readSwagger').then(result => { }).catch(e => { });;

            // #endregion

            Banyan.Log.info('Registered');
            return;
        }

        catch (e) {
            Banyan.Log.error(Utility.Messages.sendMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, e.message, "Unable to execute SetRoutes."));
            return;
        }
    }
}



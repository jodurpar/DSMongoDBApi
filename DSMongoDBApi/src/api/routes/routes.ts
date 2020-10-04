
/**
 * Routes module
 * Version 1.0.0
 * 17.08.2020 - @JoseDuranPareja
 * */

import { Log } from '../../../app';
import { Messages, version } from '../../utilities/Utility';

import { setGeneralRoute } from './setGeneralRoute';

export class Routes extends version implements IRoutes {

    private _statistics: boolean;

    public get Statistics(): boolean { return this._statistics; }
    public set Statistics(value: boolean) {
        if (value !== undefined) this._statistics = value;
    }

    public async setRoutes(server) {

        try {

            Log.info('setting routes...');

            // #region controllers

			setGeneralRoute.Set(server, 'get', '/Test', '/TestAsync', '/:message', '/messages', 'Messages', 'Test').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'get', '/Health', '/HealthAsync', '', '/health', 'Health', 'Health').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'get', '/Collections/Drop', '/CollectionsAsync/Drop', '', '/collections/drop', 'collections', 'dropCollection').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'put', '/Connection', '', '', '/connections/add', 'connection', 'addConnection').then(result => { }).catch(e => { });
            setGeneralRoute.Set(server, 'put', '/Connections', '', '', '/connections/add', 'connections', 'addConnections').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'get', '/Documents', '/DocumentsAsync', '', '/documents/get', 'Documents', 'GetDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'put', '/Documents', '/DocumentsAsync', '', '/documents/put', 'Documents', 'PutDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'put', '/Documents', '/DocumentsAsync', '/:database/:collection', '/Documents/put', 'Documents', 'PutDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'patch', '/Documents', '/DocumentsAsync', '', '/documents/patch', 'Documents', 'PatchDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'patch', '/Documents', '/DocumentsAsync', '/:database/:collection', '/Documents/patch', 'Documents', 'PatchDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'del', '/Documents', '/DocumentsAsync', '', '/documents/delete', 'Documents', 'DeleteDocuments').then(result => { }).catch(e => { });
			setGeneralRoute.Set(server, 'del', '/Documents', '/DocumentsAsync', '/:database/:collection', '/Documents/delete', 'Documents', 'DeleteDocuments').then(result => { }).catch(e => { });

            // #endregion

            // #region loggers

            setGeneralRoute.Set(server, 'put', '/ConsoleLogDown', '', '', '/logs/console', 'Console', 'Down').then(result => { }).catch(e => { });
            setGeneralRoute.Set(server, 'put', '/ConsoleLogUp', '', '', '/logs/console', 'Console', 'Up').then(result => { }).catch(e => { });

            setGeneralRoute.Set(server, 'put', '/ElasticLogDown', '', '', '/logs/elastic', 'Elastic', 'Down').then(result => { }).catch(e => { });
            setGeneralRoute.Set(server, 'put', '/ElasticLogUp', '', '', '/logs/elastic', 'Elastic', 'Up').then(result => { }).catch(e => { });

            setGeneralRoute.Set(server, 'put', '/StatisticsUp', '', '', '/logs/statistics', 'Statistics', 'Up').then(result => { }).catch(e => { });

            setGeneralRoute.Set(server, 'put', '/LogLevel', '', '', '/logs/level', 'Level', 'Set').then(result => { }).catch(e => { });


            // #endregion

            Log.info('Routes registered');
            return;
        }

        catch (e) {
            Log.fatal(Messages.sendMessage(HTTPStatusCodes.INTERNAL_SERVER_ERROR, e.message, "Unable to execute SetRoutes."));
            return;
        }
    }
}



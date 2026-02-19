import 'dotenv/config';
import { MongoConnectionManager } from './infrastructure/drivers/MongoConnectionManager';
import { createServer, AppConfig } from './infrastructure/http/app';
import pino from 'pino';

// Configuration
const PORT = parseInt(process.env.PORT || '15240', 10);
const HOST = process.env.HOST || '0.0.0.0';
const REPORTED_HOST = process.env.API_HOST_NAME || 'localhost';
console.log('******************************************');
console.log('>>> STARTING GENERIC PROXY V2.0 (MODERN) <<<');
console.log('******************************************');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'test';
const RBAC_CONFIG_PATH = process.env.RBAC_CONFIG_PATH || './src/shared/config/rbac.yaml';
const LOG_LEVEL = (process.env.LOG_LEVEL as pino.Level) || 'info';
const NODE_ENV = process.env.NODE_ENV || 'production';

const appConfig: AppConfig = {
    port: PORT,
    host: HOST,
    reportedHost: REPORTED_HOST,
    mongodbUri: MONGODB_URI,
    mongodbDatabase: MONGODB_DATABASE,
    rbacConfigPath: RBAC_CONFIG_PATH,
    logLevel: LOG_LEVEL,
    nodeEnv: NODE_ENV,
};

async function start() {
    try {
        // 1. Initialize MongoDB Connection
        const manager = MongoConnectionManager.getInstance();
        console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
        await manager.connect(MONGODB_URI, MONGODB_DATABASE);
        console.log('Connected to MongoDB successfully.');

        // 2. Create and configure Server (including routes)
        console.log('Creating server...');
        const server = await createServer(appConfig);
        console.log('Server created successfully.');

        // 3. Start Listening
        await server.listen({ port: PORT, host: HOST });

        server.log.info(`Server listening on http://${REPORTED_HOST}:${PORT}`);
        server.log.info(`Swagger documentation available at http://${REPORTED_HOST}:${PORT}/docs`);

        // Graceful Shutdown
        const shutdown = async () => {
            server.log.info('Shutting down...');
            await server.close();
            await manager.disconnectAll();
            process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (err) {
        console.error('Fatal error during startup:', err);
        process.exit(1);
    }
}

start();

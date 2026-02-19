import { FastifyInstance } from 'fastify';
import pino from 'pino';
export interface AppConfig {
    port: number;
    host: string;
    reportedHost: string;
    mongodbUri: string;
    mongodbDatabase: string;
    rbacConfigPath: string;
    logLevel: pino.Level;
    nodeEnv: string;
}
/**
 * Creates and configures the Fastify server instance.
 */
export declare function createServer(config: AppConfig): Promise<FastifyInstance>;
//# sourceMappingURL=app.d.ts.map
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
export interface RbacConfig {
    roles: Record<string, RolePermission[]>;
    default_role?: string;
    enforce_auth?: boolean;
    jwt?: {
        secret_env: string;
        issuer?: string;
        audience?: string;
    };
}
export interface RolePermission {
    collection: string;
    permissions: string[];
}
export declare class RbacMiddleware {
    private config;
    private secret;
    private constructor();
    static fromFile(filePath: string, secret: string): Promise<RbacMiddleware>;
    getMiddleware(): (request: FastifyRequest, reply: FastifyReply) => Promise<never>;
    private extractCollectionFromUrl;
    private extractToken;
    private isAllowed;
}
export declare function registerRbac(fastify: FastifyInstance, configPath: string, secretEnvVar?: string): Promise<void>;
//# sourceMappingURL=rbac.d.ts.map
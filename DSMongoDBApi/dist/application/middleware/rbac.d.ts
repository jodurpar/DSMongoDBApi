import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
/**
 * RBAC configuration as defined in the YAML file.
 */
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
/**
 * RBAC middleware for Fastify.
 * Validates JWT token, extracts role, and checks permissions for the requested collection and HTTP method.
 */
export declare class RbacMiddleware {
    private config;
    private secret;
    private constructor();
    /**
     * Load RBAC configuration from a YAML file.
     */
    static fromFile(filePath: string, secret: string): Promise<RbacMiddleware>;
    /**
     * Create middleware function that can be registered with Fastify.
     */
    getMiddleware(): (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
    private extractCollectionFromUrl;
    private extractToken;
    private isAllowed;
}
/**
 * Convenience function to register RBAC middleware with a Fastify instance.
 */
export declare function registerRbac(fastify: FastifyInstance, configPath: string, secretEnvVar?: string): Promise<void>;
//# sourceMappingURL=rbac.d.ts.map
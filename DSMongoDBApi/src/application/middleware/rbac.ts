import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'yaml';
import * as jwt from 'jsonwebtoken';

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
    permissions: string[]; // e.g., ['GET', 'POST', '*']
}

/**
 * RBAC middleware for Fastify.
 * Validates JWT token, extracts role, and checks permissions for the requested collection and HTTP method.
 */
export class RbacMiddleware {
    private config: RbacConfig;
    private secret: string;

    private constructor(config: RbacConfig, secret: string) {
        this.config = config;
        this.secret = secret;
    }

    /**
     * Load RBAC configuration from a YAML file.
     */
    static async fromFile(filePath: string, secret: string): Promise<RbacMiddleware> {
        const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
        const content = await fs.readFile(absolutePath, 'utf-8');
        const config = yaml.parse(content) as RbacConfig;
        return new RbacMiddleware(config, secret);
    }

    /**
     * Create middleware function that can be registered with Fastify.
     */
    getMiddleware() {
        return async (request: FastifyRequest, reply: FastifyReply) => {
            const { method, url } = request;
            // Extract collection from URL (simplistic example: /api/v1/collectionName/...)
            const collection = this.extractCollectionFromUrl(url);
            if (!collection) {
                // If collection cannot be determined, allow (could be a health endpoint)
                return;
            }

            const token = this.extractToken(request);
            let role: string;

            if (token) {
                try {
                    const payload = jwt.verify(token, this.secret, {
                        issuer: this.config.jwt?.issuer,
                        audience: this.config.jwt?.audience,
                    }) as any;
                    role = payload.role;
                    if (!role || typeof role !== 'string') {
                        throw new Error('Missing or invalid role claim');
                    }
                } catch (err) {
                    if (this.config.enforce_auth !== false) {
                        return reply.code(401).send({ error: 'Invalid or expired token' });
                    } else {
                        role = this.config.default_role || 'reader';
                    }
                }
            } else {
                // No token
                if (this.config.enforce_auth !== false) {
                    return reply.code(401).send({ error: 'Authentication required' });
                } else {
                    role = this.config.default_role || 'reader';
                }
            }

            // Check permissions
            const allowed = this.isAllowed(role, collection, method);
            if (!allowed) {
                return reply.code(403).send({ error: 'Insufficient permissions' });
            }
        };
    }

    private extractCollectionFromUrl(url: string): string | null {
        // Simple extraction: assume path pattern /api/v1/<collection> or /<collection>
        // This should be customized based on your route structure.
        const match = url.match(/^\/(?:api\/v\d+\/)?([^\/?]+)/);
        return match && match[1] ? match[1] : null;
    }

    private extractToken(request: FastifyRequest): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7); // Remove 'Bearer '
    }

    private isAllowed(role: string, collection: string, method: string): boolean {
        const permissions = this.config.roles[role];
        if (!permissions) {
            return false; // role not defined
        }

        // Normalize method to match permission names
        const normalizedMethod = method.toUpperCase();

        for (const perm of permissions) {
            if (perm.collection === '*' || perm.collection === collection) {
                if (perm.permissions.includes('*') || perm.permissions.includes(normalizedMethod)) {
                    return true;
                }
            }
        }
        return false;
    }
}

/**
 * Convenience function to register RBAC middleware with a Fastify instance.
 */
export async function registerRbac(
    fastify: FastifyInstance,
    configPath: string,
    secretEnvVar: string = 'JWT_SECRET'
): Promise<void> {
    const secret = process.env[secretEnvVar];
    if (!secret) {
        throw new Error(`Environment variable ${secretEnvVar} is not set`);
    }
    const middleware = await RbacMiddleware.fromFile(configPath, secret);
    fastify.addHook('onRequest', middleware.getMiddleware());
}
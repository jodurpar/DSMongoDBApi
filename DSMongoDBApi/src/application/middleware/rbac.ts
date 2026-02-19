import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'yaml';
import * as jwt from 'jsonwebtoken';

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

export class RbacMiddleware {
    private config: RbacConfig;
    private secret: string;

    private constructor(config: RbacConfig, secret: string) {
        this.config = config;
        this.secret = secret;
    }

    static async fromFile(filePath: string, secret: string): Promise<RbacMiddleware> {
        const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
        const content = await fs.readFile(absolutePath, 'utf-8');
        const config = yaml.parse(content) as RbacConfig;

        // Robust boolean parsing
        const enforce = config.enforce_auth;
        config.enforce_auth = (enforce === true || String(enforce) === 'true');

        console.log(`[RBAC BOOT] AUTH_ENABLED=${config.enforce_auth}`);
        return new RbacMiddleware(config, secret);
    }

    getMiddleware() {
        return async (request: FastifyRequest, reply: FastifyReply) => {
            const { method, url } = request;
            const lowerUrl = url.split('?')[0].toLowerCase().replace(/\/+$/, '') || '/';

            // 1. ABSOLUTE BYPASS (Must run before anything)
            if (lowerUrl === '/health' || lowerUrl.startsWith('/docs')) {
                return;
            }

            // 2. Auth Logic
            const token = this.extractToken(request);
            let role: string | undefined;

            if (token) {
                try {
                    const payload = jwt.verify(token, this.secret) as any;
                    role = payload.role;
                } catch (err: any) {
                    request.log.warn(`[RBAC] JWT_FAIL: ${err.message}`);
                }
            }

            if (!role) {
                if (this.config.enforce_auth === true) {
                    request.log.error(`[RBAC] DENIED_401: ${url}`);
                    return reply.code(401).send({
                        responseCode: 401,
                        status: 'Error',
                        error: 'RBAC_AUTH_REQUIRED',
                        message: 'Authentication required to access this resource'
                    });
                }
                role = this.config.default_role || 'reader';
            }

            const collection = this.extractCollectionFromUrl(lowerUrl);
            if (!collection) return;

            const allowed = this.isAllowed(role, collection, method);
            if (!allowed) {
                request.log.error(`[RBAC] DENIED_403: Role ${role} on ${collection}`);
                return reply.code(403).send({ error: 'RBAC_FORBIDDEN' });
            }
        };
    }

    private extractCollectionFromUrl(url: string): string | null {
        // Since we only use /Documents?collection=... or similar, 
        // the collection is usually in the query string which is NOT handled here.
        // For /Documents, we might want to check the query string instead of the path.
        const match = url.match(/^\/([^\/?]+)/);
        return match && match[1] ? match[1] : null;
    }

    private extractToken(request: FastifyRequest): string | null {
        const authHeader = request.headers.authorization || request.headers['client-authorization'] as string;
        if (!authHeader) return null;
        if (authHeader.startsWith('Bearer ')) return authHeader.substring(7);
        return authHeader;
    }

    private isAllowed(role: string, collection: string, method: string): boolean {
        const permissions = this.config.roles[role];
        if (!permissions) return false;
        const normMethod = method.toUpperCase();
        for (const perm of permissions) {
            if (perm.collection === '*' || perm.collection.toLowerCase() === collection.toLowerCase()) {
                if (perm.permissions.includes('*') || perm.permissions.includes(normMethod)) {
                    return true;
                }
            }
        }
        return false;
    }
}

export async function registerRbac(fastify: FastifyInstance, configPath: string, secretEnvVar: string = 'JWT_SECRET'): Promise<void> {
    const secret = process.env[secretEnvVar] || 'dev-secret';
    const middleware = await RbacMiddleware.fromFile(configPath, secret);
    fastify.addHook('onRequest', middleware.getMiddleware());
}
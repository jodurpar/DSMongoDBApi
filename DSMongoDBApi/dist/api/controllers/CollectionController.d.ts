import { FastifyRequest, FastifyReply } from 'fastify';
export declare class CollectionController {
    private readonly mongodbUri;
    private readonly mongodbDatabase;
    constructor(mongodbUri: string, mongodbDatabase: string);
    /**
     * Legacy TestMe.md style: GET /Documents?database=...&collection=...&filter=...
     */
    getDocuments(request: FastifyRequest, reply: FastifyReply): Promise<any[]>;
    /**
     * Legacy TestMe.md style: PUT /Documents?database=...&collection=... + JSON Body
     */
    putDocument(request: FastifyRequest, reply: FastifyReply): Promise<any>;
    /**
     * Legacy TestMe.md style: PATCH /Documents?database=...&collection=...&filter=... + JSON Body
     */
    patchDocuments(request: FastifyRequest, reply: FastifyReply): Promise<any>;
    /**
     * Legacy TestMe.md style: DELETE /Documents?database=...&collection=...&filter=...
     */
    deleteDocuments(request: FastifyRequest, reply: FastifyReply): Promise<{
        responseCode: number;
        status: string;
        data: {
            ok: number;
            n: number;
        };
    }>;
    /**
     * Legacy TestMe.md style: GET /Collections/Drop?database=...&collection=...
     */
    dropCollection(request: FastifyRequest, reply: FastifyReply): Promise<{
        responseCode: number;
        status: string;
    }>;
    list(request: FastifyRequest, reply: FastifyReply): Promise<{
        data: any[];
        meta: {
            total: number;
            limit: number;
            skip: number;
        };
    }>;
    create(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    update(request: FastifyRequest, reply: FastifyReply): Promise<{
        acknowledged: boolean;
        matchedCount: number;
        modifiedCount: number;
    }>;
    delete(request: FastifyRequest, reply: FastifyReply): Promise<{
        acknowledged: boolean;
        deletedCount: number;
    }>;
}
//# sourceMappingURL=CollectionController.d.ts.map
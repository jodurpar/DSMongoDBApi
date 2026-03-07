import { FastifyRequest, FastifyReply } from 'fastify';
import { MongoRepository } from '../../infrastructure/repositories/MongoRepository';

export class CollectionController {
    constructor(
        private readonly mongodbUri: string,
        private readonly mongodbDatabase: string
    ) { }

    /**
     * Legacy TestMe.md style: GET /Documents?database=...&collection=...&filter=...
     */
    async getDocuments(request: FastifyRequest, reply: FastifyReply) {
        const { database, collection, filter, selectedFields } = request.query as any;

        let mongoFilter: any = {};
        let projection: any = undefined;
        try {
            mongoFilter = filter ? JSON.parse(filter) : {};
            projection = selectedFields ? JSON.parse(selectedFields) : undefined;
        } catch {
            return reply.code(400).send({ error: 'Invalid JSON in filter or selectedFields parameter' });
        }

        const repository = new MongoRepository<any>(this.mongodbUri, database || this.mongodbDatabase, collection);

        try {
            const documents = await repository.find(mongoFilter, { projection });
            return documents;
        } catch (err) {
            request.log.error({ err }, `Error in getDocuments`);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }

    /**
     * Legacy TestMe.md style: PUT /Documents?database=...&collection=... + JSON Body
     */
    async putDocument(request: FastifyRequest, reply: FastifyReply) {
        const { database, collection } = request.query as any;
        const body = request.body as any;

        const repository = new MongoRepository<any>(this.mongodbUri, database || this.mongodbDatabase, collection);

        try {
            const result = await repository.insertOne(body);
            return { ...body, _id: result.insertedId };
        } catch (err) {
            request.log.error({ err }, `Error in putDocument`);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }

    /**
     * Legacy TestMe.md style: PATCH /Documents?database=...&collection=...&filter=... + JSON Body
     */
    async patchDocuments(request: FastifyRequest, reply: FastifyReply) {
        const { database, collection, filter, options } = request.query as any;
        const body = request.body as any;

        let mongoFilter: any = {};
        let mongoOptions: any = {};
        try {
            mongoFilter = filter ? JSON.parse(filter) : {};
            mongoOptions = options ? JSON.parse(options) : {};
        } catch {
            return reply.code(400).send({ error: 'Invalid JSON in filter or options parameter' });
        }

        const repository = new MongoRepository<any>(this.mongodbUri, database || this.mongodbDatabase, collection);

        try {
            const result = mongoOptions.multi === 'true'
                ? await repository.updateMany(mongoFilter, body)
                : await repository.updateOne(mongoFilter, body);

            return { acknowledged: result.acknowledged, ...body };
        } catch (err) {
            request.log.error({ err }, `Error in patchDocuments`);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }

    /**
     * Legacy TestMe.md style: DELETE /Documents?database=...&collection=...&filter=...
     */
    async deleteDocuments(request: FastifyRequest, reply: FastifyReply) {
        const { database, collection, filter } = request.query as any;

        let mongoFilter: any = {};
        try {
            mongoFilter = filter ? JSON.parse(filter) : {};
        } catch {
            return reply.code(400).send({ error: 'Invalid JSON in filter parameter' });
        }

        const repository = new MongoRepository<any>(this.mongodbUri, database || this.mongodbDatabase, collection);

        try {
            const result = await repository.deleteMany(mongoFilter);
            return {
                responseCode: 200,
                status: 'Ok',
                data: { ok: 1, n: result.deletedCount }
            };
        } catch (err) {
            request.log.error({ err }, `Error in deleteDocuments`);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
}

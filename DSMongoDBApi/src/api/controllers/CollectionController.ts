import { FastifyRequest, FastifyReply } from 'fastify';
import { MongoRepository } from '../../infrastructure/repositories/MongoRepository';
import { createSafeQueryParser } from '../../infrastructure/parsers/QueryParser';

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

        const mongoFilter = filter ? JSON.parse(filter) : {};
        const projection = selectedFields ? JSON.parse(selectedFields) : undefined;

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
        const mongoFilter = filter ? JSON.parse(filter) : {};
        const mongoOptions = options ? JSON.parse(options) : {};

        const repository = new MongoRepository<any>(this.mongodbUri, database || this.mongodbDatabase, collection);

        try {
            // TestMe seems to return the original/updated document context
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
        const mongoFilter = filter ? JSON.parse(filter) : {};

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


    // --- RE-IMPLEMENTING STANDARD V2 METHODS ---

    async list(request: FastifyRequest, reply: FastifyReply) {
        const { collection } = request.params as { collection: string };
        const query = request.query as Record<string, string | string[]>;
        const parser = createSafeQueryParser();
        const parsed = parser.parse(query);
        const repository = new MongoRepository<any>(this.mongodbUri, this.mongodbDatabase, collection);
        try {
            const findOptions: any = { sort: parsed.sort, limit: parsed.limit, skip: parsed.skip };
            if (parsed.projection) findOptions.projection = parsed.projection;
            const [documents, total] = await Promise.all([repository.find(parsed.filter, findOptions), repository.count(parsed.filter)]);
            return { data: documents, meta: { total, limit: parsed.limit, skip: parsed.skip } };
        } catch (err) { return reply.code(500).send({ error: 'Internal server error' }); }
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { collection } = request.params as { collection: string };
        const body = request.body as Record<string, any>;
        const repository = new MongoRepository<any>(this.mongodbUri, this.mongodbDatabase, collection);
        try {
            const result = await repository.insertOne(body);
            return reply.code(201).send({ acknowledged: result.acknowledged, insertedId: result.insertedId });
        } catch (err) { return reply.code(500).send({ error: 'Internal server error' }); }
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { collection, id } = request.params as { collection: string; id: string };
        const body = request.body as Record<string, any>;
        const repository = new MongoRepository<any>(this.mongodbUri, this.mongodbDatabase, collection);
        try {
            const result = await repository.updateOne({ _id: id }, body, { upsert: false });
            if (result.matchedCount === 0) return reply.code(404).send({ error: 'Document not found' });
            return { acknowledged: result.acknowledged, matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
        } catch (err) { return reply.code(500).send({ error: 'Internal server error' }); }
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { collection, id } = request.params as { collection: string; id: string };
        const repository = new MongoRepository<any>(this.mongodbUri, this.mongodbDatabase, collection);
        try {
            const result = await repository.deleteOne({ _id: id });
            if (result.deletedCount === 0) return reply.code(404).send({ error: 'Document not found' });
            return { acknowledged: result.acknowledged, deletedCount: result.deletedCount };
        } catch (err) { return reply.code(500).send({ error: 'Internal server error' }); }
    }
}

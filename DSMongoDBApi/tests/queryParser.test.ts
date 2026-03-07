import { QueryParser, createSafeQueryParser } from '../src/infrastructure/parsers/QueryParser';

describe('QueryParser', () => {
    const parser = createSafeQueryParser();

    test('should parse equality filter', () => {
        const query = { name: 'John' };
        const result = parser.parse(query);
        expect(result.filter).toEqual({ name: 'John' });
    });

    test('should parse numerical operators', () => {
        const query = { age_gt: '20', price_lte: '100' };
        const result = parser.parse(query);
        expect(result.filter).toEqual({
            age: { $gt: 20 },
            price: { $lte: 100 }
        });
    });

    test('should parse pagination (limit and skip)', () => {
        const query = { limit: '10', skip: '5' };
        const result = parser.parse(query);
        expect(result.limit).toBe(10);
        expect(result.skip).toBe(5);
    });

    test('should enforce max limit', () => {
        const query = { limit: '200' };
        const result = parser.parse(query);
        expect(result.limit).toBe(100); // maxLimit is 100 by default
    });

    test('should parse sort parameters', () => {
        const query = { sort: 'name,-createdAt' };
        const result = parser.parse(query);
        expect(result.sort).toEqual({
            name: 1,
            createdAt: -1
        });
    });

    test('should parse projection (fields)', () => {
        const query = { fields: 'name,email,-password' };
        const result = parser.parse(query);
        expect(result.projection).toEqual({
            name: 1,
            email: 1,
            password: 0
        });
    });

    test('should parse $in operator', () => {
        const query = { status_in: 'active,pending,closed' };
        const result = parser.parse(query);
        expect(result.filter).toEqual({
            status: { $in: ['active', 'pending', 'closed'] }
        });
    });

    test('should parse booleans and nulls', () => {
        const query = { active: 'true', deleted: 'false', ref: 'null' };
        const result = parser.parse(query);
        expect(result.filter).toEqual({
            active: true,
            deleted: false,
            ref: null
        });
    });

    test('should throw error on blocked operators', () => {
        const parserWithBlock = new QueryParser({ blockedOperators: ['$gt'] });
        const query = { age_gt: '20' };
        expect(() => parserWithBlock.parse(query)).toThrow("Operator '$gt' is blocked.");
    });
});

/**
 * Represents a parsed query with filter, sort, pagination, and projection.
 */
export interface ParsedQuery {
    filter: Record<string, any>;
    sort: Record<string, 1 | -1>;
    limit: number;
    skip: number;
    projection: Record<string, 0 | 1> | undefined;
}
/**
 * Configuration for the QueryParser.
 */
export interface QueryParserConfig {
    maxLimit?: number;
    defaultLimit?: number;
    allowedFields?: string[];
    blockedOperators?: string[];
}
/**
 * Dynamic Query Parser that converts URL query parameters into MongoDB query objects.
 * Implements strict type validation and NoSQL injection prevention.
 */
export declare class QueryParser {
    private readonly maxLimit;
    private readonly defaultLimit;
    private readonly allowedFields;
    private readonly blockedOperators;
    constructor(config?: QueryParserConfig);
    /**
     * Parse the query string from a URL into a ParsedQuery object.
     * @param query - The URL query parameters (e.g., { age_gt: '20', sort: '-createdAt' }).
     * @returns ParsedQuery
     * @throws Error if validation fails or an illegal operator/field is detected.
     */
    parse(query: Record<string, string | string[]>): ParsedQuery;
    private validateLimit;
    private validateSkip;
    private parseSort;
    private parseProjection;
    private parseFilter;
    private parseValue;
    private parseSingleValue;
    private isFieldAllowed;
}
/**
 * Utility function to create a QueryParser with default safe configuration.
 */
export declare function createSafeQueryParser(allowedFields?: string[]): QueryParser;
//# sourceMappingURL=QueryParser.d.ts.map
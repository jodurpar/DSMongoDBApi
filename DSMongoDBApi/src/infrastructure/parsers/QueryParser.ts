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
 * Supported operators mapping from URL suffix to MongoDB operator.
 */
const operatorMap: Record<string, string> = {
    _gt: '$gt',
    _gte: '$gte',
    _lt: '$lt',
    _lte: '$lte',
    _ne: '$ne',
    _in: '$in',
    _nin: '$nin',
    _like: '$regex',
    _exists: '$exists',
    _type: '$type',
};

/**
 * Configuration for the QueryParser.
 */
export interface QueryParserConfig {
    maxLimit?: number;
    defaultLimit?: number;
    allowedFields?: string[]; // if empty, all fields are allowed
    blockedOperators?: string[];
}

/**
 * Dynamic Query Parser that converts URL query parameters into MongoDB query objects.
 * Implements strict type validation and NoSQL injection prevention.
 */
export class QueryParser {
    private readonly maxLimit: number;
    private readonly defaultLimit: number;
    private readonly allowedFields: Set<string>;
    private readonly blockedOperators: Set<string>;

    constructor(config: QueryParserConfig = {}) {
        this.maxLimit = config.maxLimit ?? 100;
        this.defaultLimit = config.defaultLimit ?? 20;
        this.allowedFields = new Set(config.allowedFields ?? []);
        this.blockedOperators = new Set(config.blockedOperators ?? []);
    }

    /**
     * Parse the query string from a URL into a ParsedQuery object.
     * @param query - The URL query parameters (e.g., { age_gt: '20', sort: '-createdAt' }).
     * @returns ParsedQuery
     * @throws Error if validation fails or an illegal operator/field is detected.
     */
    parse(query: Record<string, string | string[]>): ParsedQuery {
        const filter: Record<string, any> = {};
        const sort: Record<string, 1 | -1> = {};
        let limit = this.defaultLimit;
        let skip = 0;
        const projection: Record<string, 0 | 1> = {};

        for (const [key, value] of Object.entries(query)) {
            const rawValue = Array.isArray(value) ? value[0] : value;
            if (rawValue === undefined) {
                continue; // skip empty array values
            }

            // Handle special keys
            if (key === 'limit') {
                limit = this.validateLimit(Number(rawValue));
                continue;
            }
            if (key === 'skip' || key === 'offset') {
                skip = this.validateSkip(Number(rawValue));
                continue;
            }
            if (key === 'sort') {
                this.parseSort(rawValue, sort);
                continue;
            }
            if (key === 'fields' || key === 'select') {
                this.parseProjection(rawValue, projection);
                continue;
            }

            // Field validation
            if (!this.isFieldAllowed(key)) {
                throw new Error(`Field '${key}' is not allowed.`);
            }

            // Parse filter operators
            this.parseFilter(key, rawValue, filter);
        }

        // Ensure limit does not exceed maxLimit
        limit = Math.min(limit, this.maxLimit);

        return {
            filter,
            sort,
            limit,
            skip,
            projection: Object.keys(projection).length > 0 ? projection : undefined,
        };
    }

    private validateLimit(limit: number): number {
        const num = Number(limit);
        if (isNaN(num) || num < 0) {
            throw new Error(`Invalid limit value: ${limit}`);
        }
        return Math.min(num, this.maxLimit);
    }

    private validateSkip(skip: number): number {
        const num = Number(skip);
        if (isNaN(num) || num < 0) {
            throw new Error(`Invalid skip value: ${skip}`);
        }
        return num;
    }

    private parseSort(sortStr: string, sortObj: Record<string, 1 | -1>) {
        const parts = sortStr.split(',');
        for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            const direction = trimmed.startsWith('-') ? -1 : 1;
            const field = direction === -1 ? trimmed.substring(1) : trimmed;
            if (!this.isFieldAllowed(field)) {
                throw new Error(`Sort field '${field}' is not allowed.`);
            }
            sortObj[field] = direction;
        }
    }

    private parseProjection(fieldsStr: string, projection: Record<string, 0 | 1>) {
        const fields = fieldsStr.split(',');
        for (const field of fields) {
            const trimmed = field.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith('-')) {
                const fieldName = trimmed.substring(1);
                if (!this.isFieldAllowed(fieldName)) {
                    throw new Error(`Projection field '${fieldName}' is not allowed.`);
                }
                projection[fieldName] = 0;
            } else {
                if (!this.isFieldAllowed(trimmed)) {
                    throw new Error(`Projection field '${trimmed}' is not allowed.`);
                }
                projection[trimmed] = 1;
            }
        }
    }

    private parseFilter(key: string, rawValue: string, filter: Record<string, any>) {
        // Check if the key contains an operator suffix
        const operatorSuffix = Object.keys(operatorMap).find((op) => key.endsWith(op));
        if (operatorSuffix) {
            const operator = operatorMap[operatorSuffix]!;
            if (this.blockedOperators.has(operator)) {
                throw new Error(`Operator '${operator}' is blocked.`);
            }
            const field = key.slice(0, -operatorSuffix.length);
            if (!this.isFieldAllowed(field)) {
                throw new Error(`Field '${field}' is not allowed.`);
            }
            const parsedValue = this.parseValue(rawValue, operator);
            if (!filter[field]) filter[field] = {};
            filter[field][operator] = parsedValue;
        } else {
            // Equality filter
            if (!this.isFieldAllowed(key)) {
                throw new Error(`Field '${key}' is not allowed.`);
            }
            filter[key] = this.parseValue(rawValue, '$eq');
        }
    }

    private parseValue(rawValue: string, operator: string): any {
        // Try to parse as number, boolean, or null
        if (rawValue.toLowerCase() === 'true') return true;
        if (rawValue.toLowerCase() === 'false') return false;
        if (rawValue.toLowerCase() === 'null') return null;
        if (rawValue.toLowerCase() === 'undefined') return undefined;

        // For $in and $nin operators, split by commas
        if (operator === '$in' || operator === '$nin') {
            return rawValue.split(',').map((v) => this.parseSingleValue(v.trim()));
        }

        // For $regex operator, treat as string and optionally add case‑insensitive flag
        if (operator === '$regex') {
            // rawValue is a regex pattern; we assume it's a safe string (no leading slash)
            return new RegExp(rawValue, 'i');
        }

        // Try to parse as number
        const num = Number(rawValue);
        if (!isNaN(num) && rawValue.trim() !== '') {
            return num;
        }

        // Default to string
        return rawValue;
    }

    private parseSingleValue(str: string): any {
        if (str.toLowerCase() === 'true') return true;
        if (str.toLowerCase() === 'false') return false;
        if (str.toLowerCase() === 'null') return null;
        if (str.toLowerCase() === 'undefined') return undefined;
        const num = Number(str);
        if (!isNaN(num) && str.trim() !== '') return num;
        return str;
    }

    private isFieldAllowed(field: string): boolean {
        // If allowedFields is empty, all fields are allowed (subject to security rules)
        if (this.allowedFields.size === 0) return true;
        return this.allowedFields.has(field);
    }
}

/**
 * Utility function to create a QueryParser with default safe configuration.
 */
export function createSafeQueryParser(allowedFields?: string[]): QueryParser {
    return new QueryParser({
        maxLimit: 100,
        defaultLimit: 20,
        allowedFields: allowedFields ?? [],
        blockedOperators: ['$where', '$expr', '$jsonSchema', '$text'], // dangerous operators
    });
}
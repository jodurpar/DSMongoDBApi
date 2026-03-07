# 🏛️ Forensic Architecture Review — DSMongoDBApi v2.0.4

**Date**: 2026-02-20  
**Reviewer Role**: Senior Solutions Architect  
**Scope**: Full codebase analysis (10 source files, 3 test files, infrastructure configs)  
**Repository**: [github.com/jodurpar/DSMongoDBApi](https://github.com/jodurpar/DSMongoDBApi)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Strengths](#3-strengths)
4. [Deficiencies](#4-deficiencies)
5. [Improvement Proposals](#5-improvement-proposals)
6. [Work Plan](#6-work-plan)

---

## 1. Executive Summary

DSMongoDBApi is a generic REST proxy for MongoDB built on Fastify v4. The project has undergone a successful migration from a legacy Restify v1 architecture to a modern stack (Fastify, Pino, Zod, JWT/RBAC). The codebase is **compact** (~1,200 LoC across 10 source files), **well-intentioned in its layering** (domain ports, infrastructure adapters, API controllers), and **operational** (Docker image published, health checks passing, Swagger UI functional).

However, the architecture review reveals several **structural gaps** that would prevent this codebase from scaling in a production enterprise environment. The most critical issues center around: **incomplete adherence to the Ports & Adapters pattern**, **lack of input validation with Zod** (despite it being a dependency), **security hardening gaps in RBAC**, and **absence of observability infrastructure** (metrics, tracing, structured error taxonomy).

**Overall Maturity Rating**: ⭐⭐⭐ (3/5) — *Functional prototype with solid foundations, needs hardening for production.*

---

## 2. Architecture Overview

### 2.1 Directory Structure

```
src/
├── api/controllers/          → HTTP Controller layer (1 file)
├── application/middleware/   → Cross-cutting RBAC middleware (1 file)
├── domain/ports/             → Interface contracts (1 file)
├── infrastructure/
│   ├── drivers/              → MongoDB connection management (1 file)
│   ├── http/                 → Fastify app factory + route registration (2 files)
│   ├── parsers/              → Query string → MongoDB query translator (1 file)
│   └── repositories/         → MongoDB IRepository implementation (1 file)
├── shared/config/            → RBAC YAML configuration (1 file)
└── server.ts                 → Entry point / bootstrap
```

### 2.2 Dependency Graph (Simplified)

```
server.ts
  └─> app.ts (createServer)
        ├─> @fastify/cors
        ├─> @fastify/swagger + swagger-ui
        ├─> @fastify/auth
        ├─> rbac.ts (middleware)
        │     └─> jsonwebtoken
        └─> genericRoutes.ts
              ├─> CollectionController
              │     └─> MongoRepository
              │           └─> MongoConnectionManager (singleton)
              └─> MongoConnectionManager (Health endpoint)
```

### 2.3 Tech Stack

| Layer      | Technology              | Version     |
| ---------- | ----------------------- | ----------- |
| Runtime    | Node.js                 | ≥20         |
| Framework  | Fastify                 | 4.26.x      |
| Database   | MongoDB Driver          | 6.5.x       |
| Auth       | jsonwebtoken            | 9.0.x       |
| Validation | Zod (unused!)           | 3.22.x      |
| Logging    | Pino                    | 8.19.x      |
| Docs       | @fastify/swagger        | 8.12.x      |
| Testing    | Jest + ts-jest          | 29.x        |
| Container  | Docker (node:20-alpine) | multi-stage |

---

## 3. Strengths

### ✅ S1 — Clean Separation of Concerns (Ports & Adapters intent)

The `IRepository<T>` interface in `domain/ports/` represents a genuine attempt at hexagonal architecture. The domain layer defines contracts without importing infrastructure code. This is the **correct architectural direction**.

### ✅ S2 — Singleton Connection Manager with Connection Pooling

`MongoConnectionManager` correctly implements:
- **Singleton pattern** to avoid connection leaks.
- **Connection caching** by `uri|dbName` key.
- **MongoClient reuse** across databases on the same URI.
- **Configurable pool sizes** (`maxPoolSize: 10, minPoolSize: 1`).

### ✅ S3 — Robust Query Parser with Security Controls

The `QueryParser` is the most mature component in the codebase:
- Operator mapping (`_gt` → `$gt`, `_like` → `$regex`).
- **Blocked operator list** prevents NoSQL injection vectors (`$where`, `$expr`, `$jsonSchema`, `$text`).
- **Field allowlisting** support.
- Pagination enforcement with `maxLimit`.
- Type coercion (strings → numbers/booleans/nulls).

### ✅ S4 — Multi-stage Docker Build

The Dockerfile follows best practices:
- **Build stage** installs devDependencies, compiles TypeScript.
- **Runner stage** copies only `dist/`, `node_modules/`, and config.
- Non-root user (`nodejs:1001`).
- `HEALTHCHECK` directive for orchestrator liveness probes.

### ✅ S5 — Comprehensive Swagger/OpenAPI Documentation

All endpoints have inline schema definitions with types, descriptions, and response structures. The Swagger UI is accessible at `/docs` with proper CSP configuration (no `upgrade-insecure-requests` bug).

### ✅ S6 — Graceful Shutdown

`server.ts` correctly handles `SIGINT` and `SIGTERM`, closing both the Fastify server and all MongoDB connections. This is critical for containerized deployments.

### ✅ S7 — CORS Properly Configured

`@fastify/cors` is registered early in the plugin chain with correct method and header allowlists.

### ✅ S8 — Test Infrastructure in Place

Jest is configured with `ts-jest`, tests cover the QueryParser (8 cases), MongoConnectionManager (3 cases), and integration tests (3 cases with mock injection).

---

## 4. Deficiencies

### 🔴 D1 — CRITICAL: `QueryParser` Is Never Used

**Impact**: HIGH  
**Location**: `CollectionController.ts`

The `QueryParser` — arguably the project's most sophisticated component — is **never invoked anywhere in the application**. The controller manually calls `JSON.parse(filter)` on raw query string parameters instead of routing them through the parser. This means:
- No operator mapping (`_gt`, `_like`, etc.) is available to API consumers.
- No blocked operator protection is active in production.
- No pagination enforcement.
- The `maxLimit`, `allowedFields`, and `blockedOperators` security controls are completely bypassed.

```typescript
// What the controller DOES (unsafe):
mongoFilter = filter ? JSON.parse(filter) : {};

// What it SHOULD do (safe):
const parsed = this.queryParser.parse(request.query);
```

### 🔴 D2 — CRITICAL: Zod Is a Dependency but Never Used

**Impact**: HIGH  
**Location**: `package.json` → `"zod": "^3.22.4"`

Zod is listed as a production dependency but is **imported nowhere** in the codebase. There is **zero input validation** on request bodies. The `PUT /Documents` endpoint accepts any JSON body and inserts it directly into MongoDB without sanitization.

### 🔴 D3 — CRITICAL: RBAC Does Not Validate Collection-Level Access

**Impact**: HIGH  
**Location**: `rbac.ts:81-82`

The RBAC middleware extracts the "collection" from the **URL path** (`/Documents` → `documents`), not from the **query string parameter** (`?collection=secrets`). Since all CRUD routes are on `/Documents`, the RBAC system always evaluates permissions against the fixed string `"documents"` instead of the actual target collection.

```typescript
// Current: always returns "documents" for /Documents?collection=anything
const collection = this.extractCollectionFromUrl(lowerUrl);

// What the user actually targets:
const { collection } = request.query; // "secrets", "users", "admin_logs"...
```

**Result**: A user with the `reader` role (GET-only) on collection `"public"` can still **DELETE** from `"private_data"` if they have any permission on the `/Documents` path.

### 🟠 D4 — HIGH: Repository Is Instantiated Per-Request

**Impact**: MEDIUM-HIGH  
**Location**: `CollectionController.ts:25,43,70,97`

Every HTTP request creates a `new MongoRepository<any>(...)`. While `ensureCollection()` reuses the cached connection from `MongoConnectionManager`, the instantiation pattern:
1. Creates unnecessary garbage collection pressure.
2. Prevents the controller from receiving a **repository via dependency injection**.
3. Breaks the Ports & Adapters pattern — the controller directly imports the concrete `MongoRepository` instead of the `IRepository<T>` interface.

### 🟠 D5 — HIGH: No Error Taxonomy / Standardized Error Responses

**Impact**: MEDIUM  
**Location**: All controller methods

Error responses are **inconsistent**:
- `getDocuments` returns `{ error: 'Internal server error' }` on 500.
- `deleteDocuments` returns `{ responseCode: 200, status: 'Ok', data: {...} }` on success.
- `putDocument` returns `{ ...body, _id: result.insertedId }` on success.
- RBAC returns `{ responseCode: 401, status: 'Error', error: 'RBAC_AUTH_REQUIRED', message: '...' }`.

There is no unified error envelope (`{ success, code, message, data, errors }`).

### 🟠 D6 — HIGH: TypeScript Strict Mode Disabled

**Impact**: MEDIUM  
**Location**: `tsconfig.build.json:10-11`

```json
"strict": false,
"noImplicitAny": false,
```

This means:
- `any` types propagate silently (the controller casts `request.query as any`).
- Null safety checks are bypassed.
- Type narrowing is unreliable.
- The `IRepository<T>` generic parameter provides a false sense of type safety.

### 🟠 D7 — HIGH: `console.log` Used Alongside Pino

**Impact**: MEDIUM  
**Location**: `server.ts:10-12,34,36,39,41`, `genericRoutes.ts:12,190`

The codebase mixes `console.log()` (unstructured, no timestamps, no log levels) with Pino (structured JSON logging). In production Docker containers, `console.log` output will appear as plain text mixed with Pino's JSON lines, breaking log aggregation pipelines (ELK, Datadog, CloudWatch).

### 🟡 D8 — MEDIUM: JWT `issuer` and `audience` Not Verified

**Impact**: MEDIUM (Security)  
**Location**: `rbac.ts:61`

```typescript
const payload = jwt.verify(token, this.secret) as any;
```

Despite `rbac.yaml` defining `issuer` and `audience`, the `jwt.verify()` call **never passes these as verification options**. Any valid JWT signed with the secret will be accepted, regardless of issuer or audience. This is a token confusion vulnerability.

### 🟡 D9 — MEDIUM: No Rate Limiting

**Impact**: MEDIUM (Security/Availability)  
**Location**: `app.ts`

There is no rate limiting on any endpoint. A single client can exhaust the MongoDB connection pool or cause resource starvation.

### 🟡 D10 — MEDIUM: `legacy/` Directory Still Ships in Docker

**Impact**: LOW  
**Location**: Dockerfile line 11

`COPY . .` in the builder stage copies the `legacy/` directory into the build context. While it doesn't end up in the `dist/` folder, it increases build context size and build time unnecessarily.

### 🟡 D11 — MEDIUM: Singleton State Leaks Between Tests

**Impact**: LOW (Testing)  
**Location**: `MongoConnectionManager.ts:14-18`

The singleton pattern caches a static `instance`. Between Jest test suites, the singleton retains state from previous tests. The `mongoManager.test.ts` works around this by calling `getInstance()` in `beforeEach`, but the cached Maps (`clients`, `dbs`) are never cleared, leading to potential test pollution.

### 🟡 D12 — MEDIUM: No `.dockerignore` File

**Impact**: LOW  
**Location**: Project root

There is no `.dockerignore`, so `node_modules/`, `.git/`, test files, and IDE configs all get sent to the Docker build context, increasing build time significantly.

### 🟡 D13 — MEDIUM: `deleteMany` Without Mandatory Filter Is Dangerous

**Impact**: MEDIUM (Safety)  
**Location**: `CollectionController.ts:90-92`

If no `filter` query parameter is provided, `mongoFilter` defaults to `{}`, which would **delete ALL documents** in the collection. This is the equivalent of SQL's `DELETE FROM table` without a `WHERE` clause.

---

## 5. Improvement Proposals

### 🔵 P1 — Wire QueryParser Into the Controller Pipeline

**Effort**: Low (2-4h)  
**Addresses**: D1

Inject a `QueryParser` instance into the `CollectionController` and use it to parse `GET /Documents` query parameters. This immediately activates operator mapping, field allowlisting, blocked operators, and pagination enforcement.

### 🔵 P2 — Implement Zod Validation Schemas for All Endpoints

**Effort**: Medium (4-8h)  
**Addresses**: D2

Create Zod schemas for:
- Query parameters (`database`, `collection`, `filter`).
- Request bodies (PUT, PATCH).
- Use `fastify-type-provider-zod` to integrate Zod with Fastify's validation pipeline, which auto-generates OpenAPI schemas from Zod definitions.

### 🔵 P3 — Fix RBAC Collection Resolution

**Effort**: Low (1-2h)  
**Addresses**: D3

Extract the target collection from `request.query.collection` instead of the URL path. Pass it through the RBAC middleware via a Fastify `preHandler` hook or a decorated request property.

### 🔵 P4 — Dependency Injection for Repository

**Effort**: Medium (4-8h)  
**Addresses**: D4

Introduce a simple factory or DI container:
```typescript
// In route registration:
const repoFactory = (db: string, col: string) => 
    new MongoRepository(mongodbUri, db, col);

// Controller receives factory, not raw URI:
constructor(private readonly createRepo: RepoFactory) {}
```

This also enables mocking the repository in tests without mocking the entire module.

### 🔵 P5 — Standardized Error Envelope

**Effort**: Low (2-4h)  
**Addresses**: D5

Create a shared error response builder:
```typescript
interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data?: T;
    errors?: { field: string; message: string }[];
    timestamp: string;
    requestId: string;
}
```

Register a Fastify `onError` hook to catch unhandled errors and format them consistently.

### 🔵 P6 — Enable TypeScript Strict Mode

**Effort**: Medium (4-8h, mostly fixing existing `any` usages)  
**Addresses**: D6

Set `"strict": true` and `"noImplicitAny": true` in `tsconfig.build.json`. Replace `as any` casts with proper types or explicit `unknown` + narrowing.

### 🔵 P7 — Replace `console.log` with Pino Logger

**Effort**: Low (1-2h)  
**Addresses**: D7

Pass the Fastify `server.log` instance to the route registration and startup functions. Replace all `console.log()` calls with `logger.info()`.

### 🔵 P8 — Add JWT Issuer/Audience Verification

**Effort**: Low (1h)  
**Addresses**: D8

```typescript
const payload = jwt.verify(token, this.secret, {
    issuer: this.config.jwt?.issuer,
    audience: this.config.jwt?.audience,
});
```

### 🔵 P9 — Add Rate Limiting

**Effort**: Low (1-2h)  
**Addresses**: D9

```bash
npm install @fastify/rate-limit
```

Configure per-IP rate limits (e.g., 100 requests/minute for reads, 20/minute for writes).

### 🔵 P10 — Add `.dockerignore`

**Effort**: Trivial (15m)  
**Addresses**: D10, D12

```
node_modules
.git
tests
legacy
*.md
.vscode
.env
dist
```

### 🔵 P11 — Protect Against Empty Filter Deletes

**Effort**: Low (30m)  
**Addresses**: D13

```typescript
if (Object.keys(mongoFilter).length === 0) {
    return reply.code(400).send({ 
        error: 'DELETE requires a non-empty filter to prevent accidental mass deletion' 
    });
}
```

### 🔵 P12 — Add Observability Layer

**Effort**: Medium (8-16h)  
**Addresses**: Production readiness

- **Metrics**: `@fastify/metrics` (Prometheus endpoint at `/metrics`).
- **Request Tracing**: Add `x-request-id` generation and propagation.
- **Health Check V2**: Add readiness (`/ready`) vs. liveness (`/health`) distinction for Kubernetes.

### 🔵 P13 — Reset Singleton in Tests

**Effort**: Trivial (30m)  
**Addresses**: D11

Add a `static resetInstance()` method to `MongoConnectionManager` guarded by `NODE_ENV === 'test'`.

---

## 6. Work Plan

### Phase 1 — Security Hardening (Sprint 1, ~2 days)

| #   | Task                                             | Addresses | Effort | Priority   |
| --- | ------------------------------------------------ | --------- | ------ | ---------- |
| 1.1 | Fix RBAC collection resolution from query string | D3        | 1-2h   | 🔴 Critical |
| 1.2 | Protect `DELETE` against empty filter            | D13       | 30m    | 🔴 Critical |
| 1.3 | Add JWT issuer/audience verification             | D8        | 1h     | 🟠 High     |
| 1.4 | Add rate limiting (`@fastify/rate-limit`)        | D9        | 1-2h   | 🟠 High     |
| 1.5 | Wire `QueryParser` into `CollectionController`   | D1        | 2-4h   | 🔴 Critical |

### Phase 2 — Code Quality & Type Safety (Sprint 2, ~3 days)

| #   | Task                                            | Addresses | Effort | Priority |
| --- | ----------------------------------------------- | --------- | ------ | -------- |
| 2.1 | Enable TypeScript strict mode + fix `any` types | D6        | 4-8h   | 🟠 High   |
| 2.2 | Implement Zod validation schemas                | D2        | 4-8h   | 🟠 High   |
| 2.3 | Replace `console.log` with Pino logger          | D7        | 1-2h   | 🟡 Medium |
| 2.4 | Standardized error envelope (`ApiResponse<T>`)  | D5        | 2-4h   | 🟡 Medium |
| 2.5 | Repository dependency injection refactor        | D4        | 4-8h   | 🟡 Medium |

### Phase 3 — Infrastructure & Ops (Sprint 3, ~2 days)

| #   | Task                                    | Addresses | Effort | Priority |
| --- | --------------------------------------- | --------- | ------ | -------- |
| 3.1 | Create `.dockerignore`                  | D10, D12  | 15m    | 🟡 Medium |
| 3.2 | Remove `legacy/` directory from repo    | D10       | 15m    | 🟡 Medium |
| 3.3 | Add singleton reset for test isolation  | D11       | 30m    | 🟡 Medium |
| 3.4 | Add Prometheus metrics endpoint         | —         | 4h     | 🟡 Medium |
| 3.5 | Add request ID tracing (`x-request-id`) | —         | 2h     | 🟡 Medium |
| 3.6 | Split health/ready endpoints for K8s    | —         | 2h     | 🟢 Low    |

### Phase 4 — Extended Test Coverage (Sprint 4, ~2 days)

| #   | Task                                      | Addresses | Effort | Priority |
| --- | ----------------------------------------- | --------- | ------ | -------- |
| 4.1 | Unit tests for `CollectionController`     | —         | 4h     | 🟡 Medium |
| 4.2 | Unit tests for RBAC middleware            | —         | 3h     | 🟡 Medium |
| 4.3 | Integration tests for PATCH and DELETE    | —         | 3h     | 🟡 Medium |
| 4.4 | Security tests (NoSQL injection attempts) | —         | 4h     | 🟠 High   |
| 4.5 | Load test baseline with `autocannon`      | —         | 2h     | 🟢 Low    |

---

## Appendix: File-by-File Verdict

| File                        | Lines | Verdict | Notes                                                                      |
| --------------------------- | ----- | ------- | -------------------------------------------------------------------------- |
| `server.ts`                 | 67    | ⭐⭐⭐⭐    | Clean bootstrap, graceful shutdown. Remove `console.log`.                  |
| `app.ts`                    | 73    | ⭐⭐⭐⭐    | Good plugin ordering. Add rate-limit and Zod provider.                     |
| `genericRoutes.ts`          | 192   | ⭐⭐⭐     | Inline schema is good. Health endpoint should be its own controller.       |
| `CollectionController.ts`   | 112   | ⭐⭐      | Direct MongoDB access, no validation, unused QueryParser.                  |
| `rbac.ts`                   | 126   | ⭐⭐⭐     | RBAC concept is correct, but collection resolution is broken.              |
| `MongoConnectionManager.ts` | 101   | ⭐⭐⭐⭐    | Solid singleton with pooling. Add test reset method.                       |
| `MongoRepository.ts`        | 185   | ⭐⭐⭐⭐    | Clean IRepository implementation. `normalizeFilter` is a nice touch.       |
| `QueryParser.ts`            | 242   | ⭐⭐⭐⭐⭐   | Best code in the project. Needs to actually be used.                       |
| `IRepository.ts`            | 110   | ⭐⭐⭐⭐    | Well-defined generic interface. Custom result types avoid MongoDB leakage. |
| `rbac.yaml`                 | 34    | ⭐⭐⭐     | `default_role: editor` + `enforce_auth: false` = wide open by default.     |

---

*Review completed on 2026-02-20 by Senior Architecture Analysis.*  
*Total source LoC analyzed: ~1,195 (excluding tests and config)*  
*Total test LoC analyzed: ~230*

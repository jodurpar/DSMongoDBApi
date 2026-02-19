# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2026-02-19

### 🔧 Hotfix & Code Cleanup

### Fixed
- **Legacy code removal**: Completely purged all Restify v1 remnants (`src/api/common/`, `src/api/decorators/`, `src/api/interfaces/`, `src/api/models/`, `src/api/routes/`, `src/api/controllers/health|collections|connections|documents|logs|messages|swagger/`, `src/utilities/`, `src/drivers/`). The codebase now contains exclusively the Fastify v2 architecture.
- **RBAC bypass bug**: Removed dead code comparison `lowerUrl === '/Health'` (string was already lowercased, making the check unreachable).
- **JSON.parse unhandled exceptions**: All `JSON.parse()` calls in `CollectionController` (getDocuments, patchDocuments, deleteDocuments) now wrapped in `try/catch` returning `400 Bad Request` with a descriptive message instead of an unhandled `500`.
- **Dead variable `REPORTED_HOST`**: Was computed in `server.ts` but never used. Now correctly propagated through `AppConfig` → `app.ts` → `genericRoutes.ts` as the authoritative reported host for Swagger and Health endpoint.
- **Host duplication in `genericRoutes.ts`**: Removed local `process.env` reads for `PORT`/`API_HOST_NAME` inside the route handler. Those values now flow from the config object, ensuring a single source of truth.
- **Docker HEALTHCHECK missing**: Added `HEALTHCHECK` directive to Dockerfile so Docker/Kubernetes can correctly monitor container liveness via `GET /Health`.
- **`tsconfig.json` over-engineered excludes**: Simplified to `"include": ["src/**/*"]` — no more manual per-directory exclusions needed since legacy code is gone.

### Added
- **Swagger Request Body for PUT and PATCH**: `PUT /Documents` and `PATCH /Documents` now declare a full `body` schema in Swagger, rendering the **Request Body** JSON editor in Swagger UI so users can input the document to insert or the fields to update directly from the browser.
- **`RBAC_CONFIG_PATH` ENV in Dockerfile**: Added to the production stage environment to avoid relying on the default relative path at runtime.
- **`reportedHost` in `AppConfig`**: New field propagated from `API_HOST_NAME` env var. Used in Swagger server URL and Health response for accurate host reporting in containerized environments.

---

## [2.0.0] - 2026-02-19


### 🚀 Remastered (Major Update)
Complete transition from legacy architecture to a modern, high-performance web framework.

### Added
- **Fastify Migration**: Replaced legacy core with Fastify for superior performance and modern middleware support.
- **RBAC Security**: Granular Role-Based Access Control implemented via `rbac.yaml`.
- **Dynamic Connection Engine**: Repository now handles dynamic database selection via query parameters.
- **Pino Logging**: High-speed, JSON-structured logging (replaces Bunyan).
- **Modern Documentation**: 
  - Integrated `fastify-swagger` and `fastify-swagger-ui`.
  - Added `CONTRIBUTING.md` and `NOTICE.md` based on company standards.
  - New high-resolution documentation images (`.jpg`).
- **VS Code Optimization**: Added `.vscode` folder with debug targets, settings, and recommended extensions.
- **Unit Testing**: Implemented a comprehensive test suite using Jest for `QueryParser` and `MongoConnectionManager`.
- **Docker Hub Documentation**: Added `readmeHub.md` specifically for Docker Hub and enhanced main `README.md` with multi-scenario Docker instructions.
- **Environment Management**: Improved `.env` documentation and included `.env.example` for easier local setup.
- **Diagnostic API**: New `/WhoAmI` endpoint for version identification.

### Changed
- **Default Port**: Switched from `51234` to **`15240`**.
- **Dynamic Routes**: `/Documents` route now accepts `database` and `collection` as query strings for universal access.
- **Health Check**: `/Health` now reports live database lists from the MongoDB server instead of static data.
- **Docker Image**: Optimized Dockerfile with multi-stage build concepts and cleaner dependency management.

### Removed
- **Legacy Files**: Deleted obsolete Visual Studio files (`.sln`, `.njsproj`).
- **Obsolete Docs**: Removed outdated `.png` screenshots and replaced them with current `.jpg` files.
- **Unsafe Features**: Removed the **"Drop Collection"** functionality to prevent accidental data destruction in proxy scenarios.
- **Legacy Core**: Removed old `app.ts` and `app.js` logic in favor of the new V2 logic.

### Fixed
- **URL Normalization**: Improved RBAC bypass logic to handle trailing slashes and case sensitivity consistently.
- **Docker Host Detection**: Implemented dynamic host reporting (`host.docker.internal` vs `localhost`).

---

## [1.0.0] - 2020-10-05

### Added
- Initial version of the API.
- Basic REST CRUD using Restify and Bunyan.
- Concept of static configuration for Mongo databases.
# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
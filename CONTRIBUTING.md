# Contribution Guide - DsMongoDBApi

Thank you for wanting to improve this Generic MongoDB Proxy! This project follows a clean, modular architecture based on **Fastify** and **TypeScript**, designed to be scalable and secure.

## Project Structure

Contributions can be made in several key areas:

### 1. API Endpoints (`src/infrastructure/http/routes/`)
If you want to add new standard routes or modify existing ones (like the dynamic `/Documents` route), this is the place. We use Fastify's schema-driven approach for automatic validation and Swagger documentation.

### 2. Query Parser (`src/infrastructure/parsers/`)
The `QueryParser` is responsible for translating URL query parameters into MongoDB-safe filters and projections. Improving its robustness or adding support for new operators is always welcome.

### 3. RBAC Configuration (`src/shared/config/rbac.yaml`)
You can suggest changes to the default role-based access control policies to support more complex scenarios (e.g., adding roles for `auditor`, `manager`, etc.).

### 4. Core Drivers (`src/infrastructure/drivers/`)
Improving the `MongoConnectionManager` to handle connections more efficiently or supporting advanced MongoDB features.

## Contributor Workflow

1.  **Open an Issue**: Discuss the change you want to make before starting work.
2.  **Pick a Task**: Ensure you are working on the latest version of the code.
3.  **Local Testing**:
    - Run `npm install`.
    - Set up a local MongoDB or use a test instance.
    - Run `npm run dev` to test your changes in real-time.
    - Verify that Swagger docs (`/docs`) reflect your changes.
4.  **Verification**: Ensure all TypeScript types are correct (`npm run build`).
5.  **Sign your Commits (DCO)**: To ensure the legal authorship of your contribution, we require all commits to include a "Signed-off-by".

## Developer Certificate of Origin (DCO)

To protect this project and its users from future legal disputes over the authorship of the code, we use the **Developer Certificate of Origin (DCO)**. By including the `Signed-off-by` line in your commit message, you certify that you have the legal right to submit your contribution.

### How to sign your commits
Just add the `-s` option to your git command:
```bash
git commit -s -m "Added support for complex projections in QueryParser"
```
This will automatically add a line at the end of your commit message similar to this:
`Signed-off-by: Your Name <your.email@example.com>`

---

*Note: We follow principles of performance and simplicity. If your change introduces heavy dependencies or significantly changes the core proxy logic, please discuss it in an Issue first.*

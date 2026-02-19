# DSMongoDBApi V2.0 (Fastify)

A secure, high-performance proxy for MongoDB with Role-Based Access Control (RBAC) and dynamic query parsing. Now upgraded to Fastify for extreme performance and modern OpenAPI/Swagger support.

## 🚀 Key Features

- **Fastify Core**: Significant performance improvements over legacy versions.
- **Dynamic Queries**: Access any database and collection using query parameters.
- **RBAC Security**: Granular control over who can read, write, or delete data based on application roles.
- **Swagger Documentation**: Interactive API documentation built-in.
- **Pino Logging**: High-speed, JSON-based logging with pretty-print option for development.
- **Docker Ready**: Optimized Dockerfile for production deployment.

## ⚙️ Installation

### Local Development

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   cd DSMongoDBApi/DSMongoDBApi
   npm install
   ```
3. **Configure Environment**:
   - For local development, it is recommended to use a `.env` file. You can create one from the provided template:
     ```bash
     cp .env.example .env
     ```
   - Main variables:
     - `MONGODB_URI`: Connection string (e.g., `mongodb://localhost:27017` or `mongodb://user:pass@host:27018`).
     - `MONGODB_DATABASE`: Default database name.
     - `PORT`: API port (default `15240`).

4. **Testing**:
   - Run unit tests using Jest:
     ```bash
     npm test
     ```

5. **Compile and Run**:
   ```bash
   npm run build
   npm start
   ```
   Or use development mode with auto-reload:
   ```bash
   npm run dev
   ```

### Running with Docker

You can pull the official image from Docker Hub or build it locally.

#### 1. Using Docker Hub (Recommended)
```bash
docker pull jodurpar/dsmongodbapi:latest

# Run with standard MongoDB port
docker run -d --name dsmongodb -p 15240:15240 jodurpar/dsmongodbapi:latest
```

#### 2. Local Build
If you want to build the image yourself:
```bash
# Build the image
docker build -t generic-mongodb-proxy .

# Run the local image
docker run -d --name dsmongodb -p 15240:15240 generic-mongodb-proxy
```

#### Custom MongoDB Configuration
In either case, if your MongoDB is on a non-standard port (e.g., 27018) or a different host, use the `MONGODB_URI` environment variable:

```bash
docker run -d \
  --name dsmongodb \
  -p 15240:15240 \
  -e MONGODB_URI="mongodb://host.docker.internal:27018" \
  jodurpar/dsmongodbapi:latest
```

## 📖 API Usage

### Interactive Documentation (Swagger)

Once the API is running, access the interactive docs at:
`http://localhost:15240/docs`

![Swagger Screen](./BrowserSwagger.jpg)

### Core Endpoints

#### 1. Health & Diagnostics
- **GET** `/Health`: Returns API status and list of available MongoDB databases.
- **GET** `/WhoAmI`: Returns version and build metadata.

#### 2. Documents CRUD (Dynamic)
Access documents by specifying `database` and `collection` in the query string.

- **GET** `/Documents?database={db}&collection={coll}&filter={json}`
- **PUT** `/Documents?database={db}&collection={coll}` (Body: JSON)
- **PATCH** `/Documents?database={db}&collection={coll}&filter={json}` (Body: JSON update)
- **DELETE** `/Documents?database={db}&collection={coll}&filter={json}`

### 🔐 Security & RBAC

The API expects the following headers for authorized requests:
- `client-authorization`: Application name (used as role in RBAC).
- `client-authentication`: (Optional) Secret token validation.

Permissions are defined in `src/shared/config/rbac.yaml`.

## 🧪 Examples & Testing

For detailed examples and postman collections, see [TestMe.md](./TestMe.md).

### Author

**José Durán Pareja**
* [github/jodurpar](https://github.com/jodurpar)

### License

Copyright © 2020-2026 [José Durán Pareja](https://github.com/jodurpar).
Released under the [MIT License](./mitLicense.md).

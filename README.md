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
3. **Configure Environment**: Create a `.env` file or set variables:
   - `PORT`: 15240 (default)
   - `MONGODB_URI`: Your Mongo connection string
4. **Compile and Run**:
   ```bash
   npm run build
   npm start
   ```
   Or use development mode with auto-reload:
   ```bash
   npm run dev
   ```

### Running with Docker

```bash
# Build the image
docker build -t generic-mongodb-proxy .

# Run the container
docker run -d --name dsmongodb -p 15240:15240 generic-mongodb-proxy
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

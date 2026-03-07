# Generic MongoDB Data Proxy (V2.0)

A high-performance, secure proxy for MongoDB built with Fastify and TypeScript. It features Role-Based Access Control (RBAC), dynamic query parsing, and interactive Swagger documentation.

## 🚀 Quick Start

### 1. Pull the image
```bash
docker pull jodurpar/dsmongodbapi:latest
```

### 2. Run the container
By default, the API listens on port **15240** and connects to `mongodb://localhost:27017`.

```bash
docker run -d \
  --name dsmongodb \
  -p 15240:15240 \
  -e MONGODB_URI="mongodb://your-mongo-host:27017" \
  jodurpar/dsmongodbapi:latest
```

## ⚙️ Configuration (Non-Standard Mongo Port)

If your MongoDB instance is running on a non-standard port (e.g., `27018`, `27019`), you **must** specify it in the `MONGODB_URI` environment variable.

### Example for Custom Port:
```bash
docker run -d \
  --name dsmongodb \
  -p 15240:15240 \
  -e MONGODB_URI="mongodb://host.docker.internal:27018" \
  jodurpar/dsmongodbapi:latest
```

### Environment Variables:
| Variable           | Description                              | Default                     |
| :----------------- | :--------------------------------------- | :-------------------------- |
| `PORT`             | API listening port                       | `15240`                     |
| `MONGODB_URI`      | MongoDB connection string                | `mongodb://localhost:27017` |
| `MONGODB_DATABASE` | Default database name                    | `test`                      |
| `LOG_LEVEL`        | Logging level (trace, debug, info, etc.) | `info`                      |

## 📖 Usage

Once running, access the interactive documentation at:
`http://localhost:15240/docs`

For detailed CRUD examples and coding integration, visit the [GitHub Repository](https://github.com/jodurpar/DSMongoDBApi).

## 🧪 Testing

The project includes a suite of unit tests built with Jest to ensure query parsing and connection management accuracy. To run them locally:
```bash
npm test
```

## 🔐 Security
Ensure you configure your RBAC settings if you intend to use this in production. The proxy requires `client-authorization` headers for mapped roles.

---
© 2026 José Durán Pareja. Released under the MIT License.

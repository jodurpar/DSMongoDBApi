# NOTICE

**DsMongoDBApi Generic Proxy**

Copyright (c) 2026 José Durán Pareja.

## Attribution
This software was designed and developed by José Durán Pareja (jodurpar) in 2019, and was fully remastered in 2026 to comply with modern software architecture standards, transitioning from a legacy Restify/Express-like approach to a high-performance **Fastify** core with **RBAC** (Role-Based Access Control).

## Data Disclaimer
This software acts as a proxy for MongoDB instances. 

1.  **Security Responsibility**: While the API provides layer of security via RBAC (Role-Based Access Control), the ultimate security of the data depends on the correct configuration of the `rbac.yaml` file and the security policies of the underlying MongoDB server.
2.  **Performance**: The API is designed for high performance, but throughput is limited by the connectivity and performance of the MongoDB cluster it connects to.
3.  **Warranty**: The software is provided "as is", without warranties of any kind, express or implied, regarding its technical accuracy or fitness for a particular purpose. José Durán Pareja is not responsible for data loss, unauthorized access, or any consequences derived from the configuration or use of this proxy in production environments.

---
To contribute to improving the features or security of this proxy, please refer to our [Contribution Guide](./CONTRIBUTING.md).

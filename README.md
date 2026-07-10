# User Profile Management API

A robust, fault-tolerant backend API for managing user profiles, built with Node.js, Express, TypeScript, and MySQL. It integrates with an external, potentially unreliable data enrichment service using resilience patterns.

## Features

- **CRUD Operations**: Complete profile management (Create, Read, Update, Delete).
- **Data Enrichment**: Fetch additional user data from an external API.
- **Resilience Patterns**: Implements Circuit Breaker (`opossum`) and custom Retry mechanisms with exponential backoff for the external service calls.
- **Clean Architecture**: Utilizes Repository and Unit of Work patterns for abstracting data access and ensuring transaction atomicity.
- **Validation**: Strict input validation using `Zod`.
- **Dockerized**: Fully containerized environment using `docker-compose`.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed.

### Running the Application

1. **Clone the repository** (if not already done).
2. **Create Environment File**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. **Start the Stack**:
   Run the following command to build and start the API, MySQL database, and the Mock Enrichment Service:
   ```bash
   docker-compose up -d --build
   ```
   *Note: It may take a few seconds for the database to initialize and the application to become healthy.*

4. **Access the API**:
   The API will be available at `http://localhost:8080/api/users`.

### API Documentation
OpenAPI specification is available in `openapi.yaml` in the root directory. You can use Swagger UI or tools like Postman to import this file and interact with the endpoints.

## Design Decisions and Patterns

### Architectural Layering
The application uses a 3-layer architecture:
- **API Layer** (Controllers/Routes): Handles HTTP requests/responses and input validation.
- **Service Layer**: Encapsulates business rules and orchestrates calls to repositories and external clients.
- **Data Access Layer**: Handles persistence logic.

### Repository Pattern
The `IUserRepository` interface decouples the application from TypeORM. `MySQLUserRepository` is the concrete implementation. This makes swapping the database or testing the service layer significantly easier.

### Unit of Work Pattern
The `IUnitOfWork` interface manages transactional scopes. Complex operations (e.g., creating a user and potentially saving related data) are wrapped in a single database transaction using `TypeORMUnitOfWork`.

### Circuit Breaker & Retry Patterns
The `ExternalEnrichmentClient` integrates with an unreliable mock service.
- **Retry**: A custom mechanism with exponential backoff handles transient failures. If a call fails, it retries up to 3 times with increasing delays (100ms, 200ms, 400ms).
- **Circuit Breaker**: `opossum` is used to prevent the system from repeatedly calling a completely failed service. If the threshold of failures is reached, the circuit opens, failing requests immediately and returning a degraded response (`enrichedDataStatus: unavailable`) to ensure the primary system remains responsive.

## Testing Instructions

### Unit Tests
Unit tests run in isolation using Jest.
```bash
npm run test
```
*Note: In the package.json add `"test": "jest tests/unit"`*

### Integration Tests
Integration tests require the database and mock service to be running.
```bash
docker-compose exec app npm run test:integration
```

git init
git remote add origin https://github.com/basasindhu04/a-Resilient-User-Profile-Management-API-with-Data-Enrichment-and-Circuit-Breaker
git branch -M main

# Commit 1
git add .gitignore
git commit -m "chore: add .gitignore to prevent committing node_modules and env files"

# Commit 2
git add package.json package-lock.json
git commit -m "chore: initialize node project and install core dependencies"

# Commit 3
git add tsconfig.json
git commit -m "build: configure typescript compiler options for express backend"

# Commit 4
git add .env.example
git commit -m "config: add environment variables template"

# Commit 5
git add Dockerfile
git commit -m "docker: create multi-stage Dockerfile for main API service"

# Commit 6
git add mock-service/package.json
git commit -m "chore(mock): initialize mock enrichment service dependencies"

# Commit 7
git add mock-service/app.js
git commit -m "feat(mock): implement configurable mock enrichment API with simulated failures"

# Commit 8
git add mock-service/Dockerfile
git commit -m "docker(mock): dockerize mock enrichment service"

# Commit 9
git add initdb/init.sql
git commit -m "db: create initial database schema and seed data for users"

# Commit 10
git add docker-compose.yml
git commit -m "docker: orchestrate api, mysql db, and mock service with healthchecks"

# Commit 11
git add src/config/database.ts
git commit -m "feat(db): configure TypeORM data source for MySQL connection"

# Commit 12
git add src/models/User.ts
git commit -m "feat(models): define User entity for TypeORM"

# Commit 13
git add src/repositories/interfaces/IUserRepository.ts
git commit -m "feat(repo): create IUserRepository interface for data access abstraction"

# Commit 14
git add src/repositories/interfaces/IUnitOfWork.ts
git commit -m "feat(repo): define IUnitOfWork interface for transaction management"

# Commit 15
git add src/repositories/impl/MySQLUserRepository.ts
git commit -m "feat(repo): implement MySQLUserRepository using TypeORM"

# Commit 16
git add src/repositories/impl/TypeORMUnitOfWork.ts
git commit -m "feat(repo): implement TypeORMUnitOfWork for managing DB transactions"

# Commit 17
git add src/utils/Errors.ts
git commit -m "feat(utils): define custom AppError classes for HTTP error mapping"

# Commit 18
git add src/utils/Retry.ts
git commit -m "feat(utils): implement generic retry logic with exponential backoff"

# Commit 19
git add src/external/EnrichmentClient.ts
git commit -m "feat(external): implement EnrichmentClient with opossum circuit breaker"

# Commit 20
git add src/services/UserService.ts
git commit -m "feat(service): implement UserService orchestrating business logic and external calls"

# Commit 21
git add src/validators/userValidator.ts
git commit -m "feat(validation): define Zod schemas for user requests"

# Commit 22
git add src/middleware/validationMiddleware.ts
git commit -m "feat(middleware): implement generic request validation middleware using Zod"

# Commit 23
git add src/middleware/errorMiddleware.ts
git commit -m "feat(middleware): implement global error handling middleware for consistent responses"

# Commit 24
git add src/controllers/UserController.ts
git commit -m "feat(controller): implement UserController mapping HTTP requests to UserService"

# Commit 25
git add src/routes/userRoutes.ts
git commit -m "feat(routes): define Express router for user endpoints"

# Commit 26
git add src/app.ts
git commit -m "feat(app): configure main Express application and setup middleware"

# Commit 27
git add openapi.yaml
git commit -m "docs: add OpenAPI specification for all user API endpoints"

# Commit 28
git add jest.config.js
git commit -m "test: configure jest for typescript unit and integration tests"

# Commit 29
git add tests/unit/UserService.test.ts
git commit -m "test(unit): add unit tests for UserService focusing on unit of work and business rules"

# Commit 30
git add tests/integration/user.api.test.ts
git commit -m "test(integration): stub integration tests for user API endpoints"

# Commit 31
git add README.md
git commit -m "docs: create comprehensive README with setup instructions and architecture design"

# Commit 32 (Catch all remaining files if any)
git add .
git commit -m "chore: final project adjustments and clean up"

# Push to remote
git push -u origin main

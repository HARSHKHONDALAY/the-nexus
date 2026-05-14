# The Nexus Backend

Phase 1 backend foundation for The Nexus: authentication, JWT sessions, refresh tokens, roles, permissions, and admin access control.

## Stack

- Java 21
- Spring Boot 3
- Maven
- PostgreSQL
- Spring Security
- JWT access tokens plus opaque refresh tokens
- Spring Data JPA / Hibernate
- Flyway migrations
- Swagger/OpenAPI

## Run Locally

```bash
cd backend
cp .env.example .env
mvn spring-boot:run
```

The API runs at `http://localhost:8080/api`.

Swagger UI is available at `http://localhost:8080/api/docs`.

## Required Environment

```bash
DATABASE_URL="postgresql://postgres:@localhost:5432/the_nexus"
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=replace-with-at-least-32-characters
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
SUPER_ADMIN_EMAIL=founder@thenexus.local
SUPER_ADMIN_PASSWORD=replace-with-strong-password
SUPER_ADMIN_NAME=The Nexus Founder
```

`SUPER_ADMIN_*` is optional but recommended for first boot. The bootstrap only creates the account if it does not already exist.

## Phase 1 API Surface

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/admin/users`
- `PATCH /api/admin/users/{adminUserId}/permissions`
- `PATCH /api/admin/users/{adminUserId}/disable`
- `GET /api/admin/access-control/roles`
- `GET /api/admin/access-control/permissions`

## Folder Structure

- `config`: Spring Security, CORS, OpenAPI, environment-backed properties, first Super Admin bootstrap.
- `security`: JWT parsing, principal model, authentication filter, user details service.
- `auth`: auth DTOs, controller, token issuing and refresh-token rotation service.
- `user`: user, refresh token, admin permission grant entities and repositories.
- `role`: role and permission entities and repositories.
- `admin`: Super Admin/Admin management endpoints and services.
- `common`: API response envelope and global exception handling.
- `resources/db/migration`: PostgreSQL schema and seed data managed by Flyway.

## Phase Boundary

This phase intentionally does not rebuild event management in Java yet. The current frontend/Prisma event operations remain separate while the Java backend establishes identity and access control. Phase 2 can migrate or integrate event modules behind the permission system introduced here.

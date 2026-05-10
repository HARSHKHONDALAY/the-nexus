# Phase 1 Auth Architecture

## Project Architecture

The Java backend is isolated in `backend/` and follows a layered architecture:

- Controller layer: HTTP contracts, validation, status semantics.
- Service layer: business rules, token lifecycle, role assignment, permission decisions.
- Repository layer: Spring Data persistence boundaries.
- Domain layer: JPA entities and enums.
- Security layer: Spring Security filter chain, JWT authentication, principal/authority mapping.
- Common layer: response envelope and exception translation.

## Maven Dependencies

Core dependencies are declared in `backend/pom.xml`:

- `spring-boot-starter-web`
- `spring-boot-starter-security`
- `spring-boot-starter-oauth2-resource-server`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-validation`
- `flyway-core`
- `flyway-database-postgresql`
- `postgresql`
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson`
- `springdoc-openapi-starter-webmvc-ui`

## PostgreSQL Schema

Flyway migration: `backend/src/main/resources/db/migration/V1__auth_foundation.sql`

Tables:

- `users`: attendee/admin identity, status, password hash, login metadata.
- `roles`: `SUPER_ADMIN`, `ADMIN`, `USER` hierarchy with immutable system roles.
- `permissions`: module/action permissions for admin features.
- `user_roles`: many-to-many role assignments.
- `role_permissions`: baseline permissions provided by each role.
- `admin_permission_grants`: dynamic ADMIN permission expansion controlled by Super Admins.
- `refresh_tokens`: hashed opaque refresh tokens with rotation family support.
- `auth_audit_events`: future-ready auth/security audit metadata.

## Entity Relationship Design

`User` has many `Role` records through `user_roles`.

`Role` has many `Permission` records through `role_permissions`.

`AdminPermissionGrant` links a specific admin user to a specific permission, allowing a Super Admin to expand access without creating a new role.

`RefreshToken` belongs to a user and stores only a SHA-256 hash of the opaque refresh token. Token families support rotation and future replay detection.

## Role Hierarchy

- `SUPER_ADMIN`: founder-level access, receives every seeded permission.
- `ADMIN`: dashboard access plus baseline read permissions; expanded by `admin_permission_grants`.
- `USER`: attendee/community account for registrations, bookings, and profile features.

## Endpoint Protection

- Public: `/api/auth/signup`, `/api/auth/login`, `/api/auth/refresh`, Swagger docs.
- Authenticated: `/api/auth/me`, `/api/auth/logout`.
- Admin shell: `/api/admin/**` requires `SUPER_ADMIN` or `ADMIN`.
- Sensitive admin mutations use method guards:
  - `admin.manage`
  - `permissions.manage`
  - `roles.read`

## Frontend Integration Contract

Send access tokens as:

```http
Authorization: Bearer <accessToken>
```

Persist the refresh token in the frontend auth layer and call `/api/auth/refresh` when the access token expires. If refresh fails, clear session state and redirect to the session-expired or login experience.

The `AuthResponse.user.roles` and `AuthResponse.user.permissions` fields are the source for role-aware rendering in the Next.js app.

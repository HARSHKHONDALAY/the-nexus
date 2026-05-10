CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL,
  normalized_email VARCHAR(320) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(160) NOT NULL,
  phone_number VARCHAR(40),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ,
  disabled_at TIMESTAMPTZ,
  disabled_reason VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_users_normalized_email UNIQUE (normalized_email),
  CONSTRAINT ck_users_status CHECK (status IN ('PENDING_VERIFICATION', 'ACTIVE', 'DISABLED', 'LOCKED'))
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(64) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  description VARCHAR(500),
  hierarchy_rank INTEGER NOT NULL,
  system_role BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_roles_code UNIQUE (code),
  CONSTRAINT ck_roles_code CHECK (code IN ('SUPER_ADMIN', 'ADMIN', 'USER')),
  CONSTRAINT ck_roles_hierarchy_rank CHECK (hierarchy_rank > 0)
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(120) NOT NULL,
  module VARCHAR(80) NOT NULL,
  action VARCHAR(80) NOT NULL,
  description VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_permissions_code UNIQUE (code)
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE admin_permission_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  granted BOOLEAN NOT NULL DEFAULT TRUE,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reason VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_admin_permission_grants UNIQUE (admin_user_id, permission_id)
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL,
  family_id UUID NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  replaced_by_token_id UUID,
  ip_address VARCHAR(80),
  user_agent VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_refresh_tokens_token_hash UNIQUE (token_hash)
);

ALTER TABLE refresh_tokens
  ADD CONSTRAINT fk_refresh_tokens_replacement
  FOREIGN KEY (replaced_by_token_id) REFERENCES refresh_tokens(id) ON DELETE SET NULL;

CREATE TABLE auth_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(80) NOT NULL,
  ip_address VARCHAR(80),
  user_agent VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_admin_permission_grants_admin ON admin_permission_grants(admin_user_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_family ON refresh_tokens(family_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX idx_auth_audit_events_user ON auth_audit_events(user_id);
CREATE INDEX idx_auth_audit_events_type ON auth_audit_events(event_type);
CREATE INDEX idx_auth_audit_events_created ON auth_audit_events(created_at);

INSERT INTO roles (code, display_name, description, hierarchy_rank, system_role)
VALUES
  ('SUPER_ADMIN', 'Super Admin', 'Founder-level access across the full Nexus operating system.', 100, TRUE),
  ('ADMIN', 'Admin', 'Module-scoped operator access controlled by Super Admins.', 50, TRUE),
  ('USER', 'User', 'Attendee and community member access.', 10, TRUE);

INSERT INTO permissions (code, module, action, description)
VALUES
  ('admin.manage', 'admin', 'manage', 'Create, disable, and update admins.'),
  ('permissions.manage', 'permissions', 'manage', 'Assign and revoke admin permissions.'),
  ('roles.read', 'roles', 'read', 'View roles and permission maps.'),
  ('users.read', 'users', 'read', 'View user profiles and account state.'),
  ('users.manage', 'users', 'manage', 'Modify user account state.'),
  ('events.read', 'events', 'read', 'View events.'),
  ('events.manage', 'events', 'manage', 'Create and update events.'),
  ('registrations.read', 'registrations', 'read', 'View registrations.'),
  ('registrations.manage', 'registrations', 'manage', 'Update registrations and check-ins.'),
  ('analytics.read', 'analytics', 'read', 'View analytics dashboards.'),
  ('finance.read', 'finance', 'read', 'View finance dashboards.'),
  ('finance.manage', 'finance', 'manage', 'Manage finance adjustments.'),
  ('moments.manage', 'moments', 'manage', 'Curate moments and event media.'),
  ('audit.read', 'audit', 'read', 'View audit logs.');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN ('roles.read', 'events.read', 'registrations.read')
WHERE r.code = 'ADMIN';

ALTER TABLE users
  ADD COLUMN admin_type VARCHAR(64),
  ADD COLUMN assigned_ecosystem_slug VARCHAR(120),
  ADD CONSTRAINT ck_users_admin_type CHECK (admin_type IS NULL OR admin_type IN ('SUPER_ADMIN', 'CHESS_NEXUS_ADMIN', 'ART_NEXUS_ADMIN')),
  ADD CONSTRAINT ck_users_ecosystem_scope CHECK (
    (admin_type IS NULL AND assigned_ecosystem_slug IS NULL)
    OR (admin_type = 'SUPER_ADMIN' AND assigned_ecosystem_slug IS NULL)
    OR (admin_type IN ('CHESS_NEXUS_ADMIN', 'ART_NEXUS_ADMIN') AND assigned_ecosystem_slug IN ('chess-nexus', 'art-nexus'))
  );

ALTER TABLE roles DROP CONSTRAINT ck_roles_code;
ALTER TABLE roles
  ADD CONSTRAINT ck_roles_code CHECK (code IN ('SUPER_ADMIN', 'CHESS_NEXUS_ADMIN', 'ART_NEXUS_ADMIN', 'ADMIN', 'USER'));

INSERT INTO roles (code, display_name, description, hierarchy_rank, system_role)
VALUES
  ('CHESS_NEXUS_ADMIN', 'Chess Nexus Admin', 'Operator access scoped to Chess Nexus events and attendees.', 60, TRUE),
  ('ART_NEXUS_ADMIN', 'Art Nexus Admin', 'Operator access scoped to Art Nexus events and attendees.', 60, TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'roles.read',
  'events.read',
  'events.manage',
  'registrations.read',
  'registrations.manage',
  'finance.read',
  'moments.manage'
)
WHERE r.code IN ('CHESS_NEXUS_ADMIN', 'ART_NEXUS_ADMIN')
ON CONFLICT DO NOTHING;

UPDATE users
SET admin_type = 'SUPER_ADMIN'
WHERE admin_type IS NULL
  AND EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = users.id AND r.code = 'SUPER_ADMIN'
  );

CREATE INDEX idx_users_admin_type ON users(admin_type);
CREATE INDEX idx_users_assigned_ecosystem ON users(assigned_ecosystem_slug);

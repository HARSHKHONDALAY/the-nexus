ALTER TABLE users
  ADD COLUMN username VARCHAR(80),
  ADD COLUMN normalized_username VARCHAR(80);

CREATE UNIQUE INDEX uk_users_normalized_username
  ON users(normalized_username)
  WHERE normalized_username IS NOT NULL;

ALTER TABLE platform_audit_logs
  ADD COLUMN ecosystem_slug VARCHAR(120);

CREATE INDEX idx_platform_audit_logs_ecosystem_created
  ON platform_audit_logs(ecosystem_slug, created_at DESC);

CREATE INDEX idx_finance_entries_event_deleted
  ON finance_entries(event_id, deleted_at);

ALTER TABLE platform_events
  ADD COLUMN registration_open BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN allow_walk_ins BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN visibility VARCHAR(32) NOT NULL DEFAULT 'PUBLIC',
  ADD COLUMN seo_title VARCHAR(220),
  ADD COLUMN seo_description VARCHAR(320),
  ADD COLUMN venue_cost_paise BIGINT NOT NULL DEFAULT 0,
  ADD CONSTRAINT ck_platform_events_visibility CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'UNLISTED')),
  ADD CONSTRAINT ck_platform_events_venue_cost CHECK (venue_cost_paise >= 0);

ALTER TABLE bookings
  ADD COLUMN source_type VARCHAR(40) NOT NULL DEFAULT 'website',
  ADD COLUMN instagram_id VARCHAR(120),
  ADD COLUMN attendee_age INTEGER,
  ADD COLUMN attendee_location VARCHAR(160),
  ADD COLUMN occupation VARCHAR(160),
  ADD COLUMN payment_method VARCHAR(80),
  ADD COLUMN notes VARCHAR(1000),
  ADD COLUMN walk_in BOOLEAN NOT NULL DEFAULT FALSE,
  ADD CONSTRAINT ck_bookings_source_type CHECK (source_type IN ('website', 'manual', 'instagram', 'partner', 'walk_in')),
  ADD CONSTRAINT ck_bookings_attendee_age CHECK (attendee_age IS NULL OR attendee_age BETWEEN 1 AND 120);

CREATE TABLE finance_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES platform_events(id) ON DELETE CASCADE,
  entry_type VARCHAR(40) NOT NULL,
  amount_paise BIGINT NOT NULL,
  note VARCHAR(1000),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ck_finance_entries_type CHECK (entry_type IN ('REVENUE', 'EXPENSE', 'VENUE_COST', 'REFUND', 'MISC')),
  CONSTRAINT ck_finance_entries_amount CHECK (amount_paise >= 0)
);

CREATE INDEX idx_platform_events_registration_open ON platform_events(registration_open);
CREATE INDEX idx_bookings_event_source ON bookings(event_id, source_type);
CREATE INDEX idx_bookings_attendee_name ON bookings(attendee_name);
CREATE INDEX idx_finance_entries_event ON finance_entries(event_id);
CREATE INDEX idx_finance_entries_type ON finance_entries(entry_type);
CREATE INDEX idx_finance_entries_deleted ON finance_entries(deleted_at);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code = 'registrations.manage'
WHERE r.code = 'ADMIN'
ON CONFLICT DO NOTHING;

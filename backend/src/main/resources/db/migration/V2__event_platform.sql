CREATE TABLE event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) NOT NULL,
  name VARCHAR(160) NOT NULL,
  description VARCHAR(800),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_event_categories_slug UNIQUE (slug)
);

CREATE TABLE platform_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES event_categories(id) ON DELETE RESTRICT,
  slug VARCHAR(160) NOT NULL,
  title VARCHAR(220) NOT NULL,
  subtitle VARCHAR(260),
  description TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  venue_name VARCHAR(220) NOT NULL,
  venue_address VARCHAR(600),
  city VARCHAR(120) NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  timezone VARCHAR(80) NOT NULL DEFAULT 'Asia/Kolkata',
  banner_url VARCHAR(1000),
  hero_media_url VARCHAR(1000),
  capacity INTEGER NOT NULL,
  waitlist_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_platform_events_slug UNIQUE (slug),
  CONSTRAINT ck_platform_events_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'LIVE', 'SOLD_OUT', 'CLOSED', 'CANCELLED', 'ARCHIVED')),
  CONSTRAINT ck_platform_events_capacity CHECK (capacity >= 0),
  CONSTRAINT ck_platform_events_time CHECK (ends_at > starts_at)
);

CREATE TABLE event_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES platform_events(id) ON DELETE CASCADE,
  title VARCHAR(220) NOT NULL,
  description VARCHAR(1000),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ticket_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES platform_events(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  description VARCHAR(800),
  price_paise BIGINT NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  capacity INTEGER NOT NULL,
  sold_count INTEGER NOT NULL DEFAULT 0,
  reserved_count INTEGER NOT NULL DEFAULT 0,
  sales_start_at TIMESTAMPTZ,
  sales_end_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ck_ticket_tiers_price CHECK (price_paise >= 0),
  CONSTRAINT ck_ticket_tiers_capacity CHECK (capacity >= 0),
  CONSTRAINT ck_ticket_tiers_counts CHECK (sold_count >= 0 AND reserved_count >= 0 AND sold_count + reserved_count <= capacity)
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference VARCHAR(40) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_id UUID NOT NULL REFERENCES platform_events(id) ON DELETE RESTRICT,
  ticket_tier_id UUID NOT NULL REFERENCES ticket_tiers(id) ON DELETE RESTRICT,
  attendee_name VARCHAR(160) NOT NULL,
  attendee_email VARCHAR(320) NOT NULL,
  attendee_phone VARCHAR(40),
  quantity INTEGER NOT NULL,
  amount_paise BIGINT NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING_PAYMENT',
  payment_deadline_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason VARCHAR(600),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_bookings_reference UNIQUE (booking_reference),
  CONSTRAINT ck_bookings_quantity CHECK (quantity > 0),
  CONSTRAINT ck_bookings_amount CHECK (amount_paise >= 0),
  CONSTRAINT ck_bookings_status CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'WAITLISTED', 'CANCELLED', 'EXPIRED', 'REFUND_PENDING', 'REFUNDED'))
);

CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  ticket_code VARCHAR(64) NOT NULL,
  qr_token_hash VARCHAR(128) NOT NULL,
  attendee_name VARCHAR(160) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_tickets_code UNIQUE (ticket_code),
  CONSTRAINT uk_tickets_qr_token_hash UNIQUE (qr_token_hash),
  CONSTRAINT ck_tickets_status CHECK (status IN ('ACTIVE', 'CHECKED_IN', 'CANCELLED', 'REFUNDED', 'VOID'))
);

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider VARCHAR(40) NOT NULL DEFAULT 'RAZORPAY',
  provider_order_id VARCHAR(120) NOT NULL,
  provider_payment_id VARCHAR(120),
  provider_refund_id VARCHAR(120),
  amount_paise BIGINT NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  status VARCHAR(40) NOT NULL DEFAULT 'ORDER_CREATED',
  signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  idempotency_key VARCHAR(160) NOT NULL,
  raw_payload JSONB,
  failure_reason VARCHAR(800),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_payment_transactions_order UNIQUE (provider_order_id),
  CONSTRAINT uk_payment_transactions_idempotency UNIQUE (idempotency_key),
  CONSTRAINT ck_payment_transactions_status CHECK (status IN ('ORDER_CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUND_PENDING', 'REFUNDED'))
);

CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES platform_events(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  media_type VARCHAR(32) NOT NULL,
  storage_key VARCHAR(1000) NOT NULL,
  public_url VARCHAR(1000),
  mime_type VARCHAR(160) NOT NULL,
  size_bytes BIGINT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'UPLOADED',
  alt_text VARCHAR(300),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uk_media_assets_storage_key UNIQUE (storage_key),
  CONSTRAINT ck_media_assets_type CHECK (media_type IN ('IMAGE', 'VIDEO', 'THUMBNAIL')),
  CONSTRAINT ck_media_assets_status CHECK (status IN ('UPLOADED', 'PROCESSING', 'PUBLISHED', 'ARCHIVED', 'REJECTED')),
  CONSTRAINT ck_media_assets_size CHECK (size_bytes > 0)
);

CREATE TABLE notification_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email VARCHAR(320) NOT NULL,
  template_key VARCHAR(120) NOT NULL,
  subject VARCHAR(240) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'QUEUED',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error VARCHAR(1000),
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ck_notification_jobs_status CHECK (status IN ('QUEUED', 'SENT', 'FAILED', 'CANCELLED'))
);

CREATE TABLE platform_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  action VARCHAR(120) NOT NULL,
  metadata JSONB,
  ip_address VARCHAR(80),
  user_agent VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_platform_events_category ON platform_events(category_id);
CREATE INDEX idx_platform_events_status ON platform_events(status);
CREATE INDEX idx_platform_events_starts_at ON platform_events(starts_at);
CREATE INDEX idx_ticket_tiers_event ON ticket_tiers(event_id);
CREATE INDEX idx_bookings_event ON bookings(event_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_tickets_booking ON tickets(booking_id);
CREATE INDEX idx_payment_transactions_booking ON payment_transactions(booking_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_media_assets_event ON media_assets(event_id);
CREATE INDEX idx_notification_jobs_status ON notification_jobs(status);
CREATE INDEX idx_platform_audit_logs_entity ON platform_audit_logs(entity_type, entity_id);

INSERT INTO event_categories (slug, name, description)
VALUES
  ('chess-nexus', 'Chess Nexus', 'Cinematic social chess events and strategy-led community nights.'),
  ('art-nexus', 'Art Nexus', 'Immersive art, texture, and creative workshop experiences.'),
  ('networking', 'Networking', 'Premium youth networking rooms and founder-led community formats.'),
  ('workshops', 'Workshops', 'Skill-building cultural and creative sessions.');

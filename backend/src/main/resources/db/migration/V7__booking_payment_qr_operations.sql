ALTER TABLE tickets
  ADD COLUMN qr_token_ciphertext TEXT;

UPDATE tickets
SET qr_token_ciphertext = qr_token_hash
WHERE qr_token_ciphertext IS NULL;

ALTER TABLE tickets
  ALTER COLUMN qr_token_ciphertext SET NOT NULL;

CREATE TABLE ticket_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  qr_token_hash VARCHAR(128),
  result VARCHAR(40) NOT NULL,
  reason VARCHAR(600),
  scanned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address VARCHAR(80),
  user_agent VARCHAR(500),
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payment_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_event_id VARCHAR(160) NOT NULL,
  event_type VARCHAR(80) NOT NULL,
  payload_hash VARCHAR(128) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'RECEIVED',
  raw_payload JSONB NOT NULL,
  error_message VARCHAR(1000),
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  CONSTRAINT uk_payment_webhook_events_provider_event UNIQUE (provider_event_id),
  CONSTRAINT ck_payment_webhook_status CHECK (status IN ('RECEIVED', 'PROCESSED', 'IGNORED', 'FAILED'))
);

CREATE UNIQUE INDEX uk_payment_transactions_payment_id
  ON payment_transactions(provider_payment_id)
  WHERE provider_payment_id IS NOT NULL;

CREATE UNIQUE INDEX uk_payment_transactions_refund_id
  ON payment_transactions(provider_refund_id)
  WHERE provider_refund_id IS NOT NULL;

CREATE INDEX idx_ticket_scans_ticket ON ticket_scans(ticket_id);
CREATE INDEX idx_ticket_scans_hash ON ticket_scans(qr_token_hash);
CREATE INDEX idx_payment_webhook_events_status ON payment_webhook_events(status);

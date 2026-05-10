CREATE UNIQUE INDEX uk_active_booking_per_event_email
  ON bookings (event_id, lower(attendee_email))
  WHERE status IN ('PENDING_PAYMENT', 'CONFIRMED', 'WAITLISTED');

CREATE INDEX idx_bookings_payment_deadline ON bookings(payment_deadline_at);

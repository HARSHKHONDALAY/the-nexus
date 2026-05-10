# Phase 2 Event Platform Backend

## Event Management Architecture

Phase 2 expands the Java backend into the production event platform. The core aggregate is `PlatformEvent`, categorized by `EventCategory` and monetized through `TicketTier`.

Event lifecycle:

- `DRAFT`
- `PUBLISHED`
- `LIVE`
- `SOLD_OUT`
- `CLOSED`
- `CANCELLED`
- `ARCHIVED`

Admin APIs live behind `events.manage` and `events.read`. Public event discovery only returns published/live/sold-out events.

## Database Schema Expansion

Migration: `backend/src/main/resources/db/migration/V2__event_platform.sql`

New tables:

- `event_categories`
- `platform_events`
- `event_schedules`
- `ticket_tiers`
- `bookings`
- `tickets`
- `payment_transactions`
- `media_assets`
- `notification_jobs`
- `platform_audit_logs`

The schema uses UUID primary keys, normalized relations, status checks, inventory constraints, idempotency keys, QR token hashes, and indexes for dashboard queries.

## Ticketing System Design

Booking flow:

1. Client creates a booking with event, ticket tier, attendee data, and quantity.
2. Backend locks the ticket tier row with a pessimistic write lock.
3. Backend reserves inventory and creates a `PENDING_PAYMENT` booking.
4. Client creates a Razorpay order for that booking.
5. Client verifies payment with Razorpay signature.
6. Backend confirms booking, converts reserved inventory into sold inventory, and issues tickets.

Ticket QR security:

- Raw QR tokens are never stored.
- Only SHA-256 hashes are stored in `tickets.qr_token_hash`.
- Check-in hashes the presented token and rejects duplicate check-ins.

## Payment Integration Architecture

Razorpay integration uses:

- API order creation with Basic Auth.
- HMAC-SHA256 payment signature verification.
- Webhook HMAC verification.
- `payment_transactions.idempotency_key` to prevent duplicate order creation.
- `provider_order_id` uniqueness to make payment handling idempotent.

Required variables:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

## Media Management

Media upload flow:

1. Admin requests an upload URL.
2. Backend validates MIME type and file size.
3. Backend creates a deterministic S3 key under `events/{eventSlug}/...`.
4. Backend returns a 10-minute presigned S3 PUT URL.
5. Metadata is stored in `media_assets`.

Allowed image MIME types:

- `image/jpeg`
- `image/png`
- `image/webp`

Allowed video MIME types:

- `video/mp4`
- `video/quicktime`
- `video/webm`

## Deployment

Local production-like boot:

```bash
docker compose up --build
```

Backend:

```bash
cd backend
mvn test
mvn spring-boot:run
```

Health endpoints:

- `/api/actuator/health`
- `/api/actuator/info`
- `/api/actuator/metrics`

Swagger:

- `/api/docs`

## Production Readiness Checklist

- Use a long random `JWT_SECRET`.
- Configure production PostgreSQL with SSL.
- Configure Razorpay live keys and webhook secret.
- Configure AWS credentials via the runtime environment, not code.
- Restrict `CORS_ALLOWED_ORIGINS` to production domains.
- Put the backend behind HTTPS.
- Enable provider webhook retries in Razorpay.
- Monitor actuator health and structured request logs.
- Add object lifecycle rules to the S3 bucket.
- Keep admin endpoints permission-gated.

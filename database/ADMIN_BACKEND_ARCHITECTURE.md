# The Nexus Admin Backend Architecture

## Legacy SQL analysis

The dump contains a WordPress-prefixed operational backend for Chess Nexus:

- `wp_chess_nexus_events`: event setup, pricing, venue cost, event key, seat limits, payment links, soft delete state.
- `wp_chess_nexus_event_meta`: extra expenses plus registration closed and archived flags keyed by `event_key`.
- `wp_chess_nexus_registrations`: attendee form submissions, payment screenshot, check-in state, source type, payment status, and duplicated event snapshot fields.
- `wp_chess_nexus_finance_adjustments`: revenue/venue/expense rows keyed by `event_key` with add/subtract operators.
- `wp_chess_nexus_audit_log`: operational activity keyed by `event_key` and action metadata.

## Weaknesses modernized

- WordPress table prefixes and PHP naming conventions removed.
- String-only `event_key` joins replaced with relational `eventId` foreign keys.
- Event meta merged into `Event` where it represents lifecycle state.
- Duplicated registration event fields preserved only as immutable snapshot columns for historical accuracy.
- Free-form status strings converted into Prisma enums.
- `checked_in` boolean upgraded to `CheckInStatus` for late/no-show workflows.
- Finance adjustment sections/operators normalized into enums.
- Audit logs support structured `metadata` JSON for future automation and command-center history.
- Added indexes for event date, lifecycle, payment, source, check-in, archive, and audit queries.

## Backend folder structure

- `prisma/schema.prisma`: source of truth database schema.
- `prisma/seed.ts`: realistic seed architecture for events, attendees, finance, and audit logs.
- `src/lib/db/client.ts`: singleton Prisma client.
- `src/lib/services`: business logic for events, attendees, finance, and audit logs.
- `src/lib/actions`: Next.js server actions for admin workflows.
- `src/lib/validators`: Zod schemas for mutation input validation.
- `src/lib/types`: reusable admin-facing TypeScript structures.
- `src/lib/utils`: operational helpers such as finance and occupancy calculations.

## Supported operational workflows

- Current, past, and archived event management.
- Registration open/closed lifecycle state.
- Event creation, duplication, archive, and restore.
- Manual attendee creation.
- Payment status management.
- Individual and bulk check-ins.
- Revenue, expense, refund, venue, discount, and operations adjustments.
- Event financial summaries.
- Immutable audit trail for admin action history.
- Moment/media assets linked to events.

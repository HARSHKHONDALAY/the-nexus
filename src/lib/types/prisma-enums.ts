/**
 * TypeScript union types replacing Prisma enums
 * These types match the actual string values stored in the database
 */

// Event status types (from platform_events.status field)
export type EventStatus = 
  | "DRAFT" 
  | "PUBLISHED" 
  | "LIVE" 
  | "SOLD_OUT" 
  | "CLOSED" 
  | "CANCELLED" 
  | "ARCHIVED";

// Booking status types (from bookings.status field)
export type BookingStatus = 
  | "PENDING_PAYMENT" 
  | "CONFIRMED" 
  | "CANCELLED" 
  | "REFUNDED" 
  | "EXPIRED";

// Payment transaction status types (from payment_transactions.status field)
export type PaymentStatus = 
  | "ORDER_CREATED" 
  | "PAID" 
  | "FAILED" 
  | "REFUNDED" 
  | "PARTIALLY_REFUNDED";

// Ticket status types (from tickets.status field)
export type TicketStatus = 
  | "ACTIVE" 
  | "USED" 
  | "CANCELLED" 
  | "EXPIRED";

// Booking source types (from bookings.source_type field)
export type BookingSource = 
  | "website" 
  | "instagram" 
  | "admin" 
  | "walk_in";

// User status types (from users.status field)
export type UserStatus = 
  | "ACTIVE" 
  | "DISABLED" 
  | "SUSPENDED";

// Event visibility types (from platform_events.visibility field)
export type EventVisibility = 
  | "PUBLIC" 
  | "PRIVATE" 
  | "UNLISTED";

// Media asset status types (from media_assets.status field)
export type MediaAssetStatus = 
  | "UPLOADING" 
  | "UPLOADED" 
  | "FAILED" 
  | "PROCESSING";

// Notification job status types (from notification_jobs.status field)
export type NotificationJobStatus = 
  | "QUEUED" 
  | "SENT" 
  | "FAILED" 
  | "CANCELLED";

// Payment webhook event status types (from payment_webhook_events.status field)
export type WebhookEventStatus = 
  | "RECEIVED" 
  | "PROCESSED" 
  | "FAILED" 
  | "IGNORED";

// Media asset types (from media_assets.media_type field)
export type MediaAssetType = 
  | "image" 
  | "video" 
  | "document" 
  | "audio";

// Finance entry types (from finance_entries.entry_type field)
export type FinanceEntryType = 
  | "REVENUE" 
  | "EXPENSE" 
  | "REFUND" 
  | "ADJUSTMENT";

// Payment provider types (from payment_transactions.provider field)
export type PaymentProvider = 
  | "RAZORPAY" 
  | "STRIPE" 
  | "PAYPAL";

// Role hierarchy for user roles
export type RoleCode = 
  | "SUPER_ADMIN" 
  | "ADMIN" 
  | "EVENT_MANAGER" 
  | "FINANCE_MANAGER" 
  | "USER";

// Permission modules
export type PermissionModule = 
  | "events" 
  | "bookings" 
  | "finance" 
  | "users" 
  | "admin" 
  | "media";

// Permission actions
export type PermissionAction = 
  | "create" 
  | "read" 
  | "update" 
  | "delete" 
  | "manage" 
  | "approve";

// Default values for common types
export const DEFAULT_EVENT_STATUS: EventStatus = "DRAFT";
export const DEFAULT_BOOKING_STATUS: BookingStatus = "PENDING_PAYMENT";
export const DEFAULT_PAYMENT_STATUS: PaymentStatus = "ORDER_CREATED";
export const DEFAULT_TICKET_STATUS: TicketStatus = "ACTIVE";
export const DEFAULT_BOOKING_SOURCE: BookingSource = "website";
export const DEFAULT_USER_STATUS: UserStatus = "ACTIVE";
export const DEFAULT_EVENT_VISIBILITY: EventVisibility = "PUBLIC";
export const DEFAULT_MEDIA_ASSET_STATUS: MediaAssetStatus = "UPLOADED";
export const DEFAULT_NOTIFICATION_JOB_STATUS: NotificationJobStatus = "QUEUED";
export const DEFAULT_WEBHOOK_EVENT_STATUS: WebhookEventStatus = "RECEIVED";
export const DEFAULT_PAYMENT_PROVIDER: PaymentProvider = "RAZORPAY";

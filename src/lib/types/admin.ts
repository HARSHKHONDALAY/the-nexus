import type { EventStatus, BookingStatus, TicketStatus, BookingSource } from "@/lib/types/prisma-enums";

export interface EventListFilters {
  status?: EventStatus;
  archived?: boolean;
  includeDeleted?: boolean;
}

export interface AttendeeListFilters {
  eventId?: string;
  source_type?: BookingSource;
  status?: BookingStatus;
  ticket_status?: TicketStatus;
  query?: string;
}

export interface EventOperationalSummary {
  eventId: string;
  bookings: number;
  verifiedPayments: number;
  checkedIn: number;
  occupancyPercent: number;
  grossRevenue: number;
  adjustmentTotal: number;
  projectedNet: number;
}

export interface BulkAttendeeOperationResult {
  requested: number;
  updated: number;
  skipped: number;
}

export interface BookingStateTransition {
  bookingId: string;
  from: BookingStatus;
  to: BookingStatus;
  reason?: string;
}

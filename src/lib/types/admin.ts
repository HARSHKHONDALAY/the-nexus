import type { CheckInStatus, EventStatus, PaymentStatus, RegistrationSource, RegistrationStatus } from "@prisma/client";

export interface EventListFilters {
  status?: EventStatus;
  archived?: boolean;
  includeDeleted?: boolean;
}

export interface AttendeeListFilters {
  eventId?: string;
  sourceType?: RegistrationSource;
  paymentStatus?: PaymentStatus;
  checkInStatus?: CheckInStatus;
  query?: string;
}

export interface EventOperationalSummary {
  eventId: string;
  registrations: number;
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

export interface RegistrationStateTransition {
  registrationId: string;
  from: RegistrationStatus;
  to: RegistrationStatus;
  reason?: string;
}

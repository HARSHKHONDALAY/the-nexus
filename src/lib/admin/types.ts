import type { EventStatus, PaymentStatus, BookingSource, TicketStatus } from "@/lib/types/prisma-enums";

export type SourceType = BookingSource;
export type CheckInState = TicketStatus;

export interface AdminEvent {
  id: string;
  event_key: string;
  title: string;
  event_date: string;
  date_label: string;
  time_label: string;
  venue: string;
  location_short: string;
  price: number;
  venue_cost: number;
  max_seats: number;
  upi_id: string;
  whatsapp_link: string;
  qr_image: string;
  logo: string;
  default_status: EventStatus;
  registration_closed: boolean;
  archived_to_past: boolean;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  attendee_name: string;
  email: string;
  phone: string;
  instagram_id: string;
  occupation: string;
  working_sector: string;
  chess_level?: "beginner" | "intermediate" | "advanced" | "spectator";
  dietary_preference: string;
  payment_screenshot: string;
  agreement_status: boolean;
  check_in_state: CheckInState;
  source_type: SourceType;
  payment_status: PaymentStatus;
  attendee_notes: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceAdjustment {
  id: string;
  event_id: string;
  adjustment_section: "revenue" | "expense" | "refund" | "venue" | "operations";
  operator: string;
  amount: number;
  comments: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  event_id?: string;
  action_key: string;
  action_label: string;
  details: string;
  operator: string;
  created_at: string;
  updated_at: string;
}

export interface MomentAsset {
  id: string;
  event_id: string;
  title: string;
  type: "image" | "video";
  url: string;
  status: "draft" | "published" | "curating";
  captured_at: string;
}

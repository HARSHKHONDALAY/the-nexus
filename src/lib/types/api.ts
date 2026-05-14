// Centralized API type definitions for The Nexus
// Matching actual backend DTO structure

export interface TicketTier {
  id: string;
  name: string;
  description: string;
  price_paise: number;
  currency: string;
  capacity: number;
  sold_count: number;
  reserved_count: number;
  sales_start_at?: string;
  sales_end_at?: string;
  active: boolean;
  sort_order: number;
}

export interface EventCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface PlatformEvent {
  id: string;
  category: EventCategory;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "LIVE" | "SOLD_OUT" | "CLOSED" | "CANCELLED" | "ARCHIVED";
  venue_name: string;
  venue_address?: string;
  city: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  banner_url?: string;
  hero_media_url?: string;
  capacity: number;
  waitlist_enabled: boolean;
  registration_open: boolean;
  allow_walk_ins: boolean;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  seo_title?: string;
  seo_description?: string;
  venue_cost_paise: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  ticket_tiers?: TicketTier[];
}

// Frontend-specific EventData interface (mapped from PlatformEvent)
export interface EventData {
  slug: string;
  eventKey: string;
  title: string;
  world: string;
  mood: string;
  dateISO: string;
  type: string;
  featured: boolean;
  tagline: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  capacity: string;
  remainingSpots: number;
  dressCode: string;
  agePolicy: string;
  priceFrom: string;
  description: string;
  longDescription: string;
  gallery: string[];
  vibePoints: string[];
  timeline: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  ticketTiers: TicketTierData[];
  posterImageUrl?: string;
}

export interface TicketTierData {
  id: string;
  name: string;
  price: string;
  note: string;
  perks: string[];
  status: "available" | "limited" | "sold_out";
}

export interface EventMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt_text?: string;
  caption?: string;
  sort_order?: number;
  event_id: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  event_id: string;
  user_id: string;
  ticket_tier_id: string;
  quantity: number;
  total_amount: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
  payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface EventWithTicketTiers extends PlatformEvent {
  ticket_tiers: TicketTier[];
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  starts_at: string;
  ends_at?: string;
  venue?: string;
  world?: string;
  category_id?: string;
  max_attendees?: number;
  ticket_tiers?: Omit<TicketTier, 'id' | 'event_id' | 'created_at' | 'updated_at'>[];
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

export interface CreateBookingRequest {
  event_id: string;
  ticket_tier_id: string;
  quantity: number;
  attendee_info?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  razorpay_order_id: string;
  status: 'CREATED' | 'PAID' | 'FAILED';
  created_at: string;
  expires_at: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Admin-specific types
export interface AdminEvent extends PlatformEvent {
  admin_notes?: string;
  internal_status?: string;
  revenue_generated?: number;
}

export interface AdminDashboard {
  total_events: number;
  total_bookings: number;
  total_revenue: number;
  upcoming_events: PlatformEvent[];
  recent_bookings: Booking[];
}

// Utility types for API responses
export type ApiResult<T> = Promise<ApiResponse<T>>;
export type ApiResultList<T> = Promise<ApiResponse<T[]>>;
export type ApiResultPaginated<T> = Promise<ApiResponse<PaginatedResponse<T>>>;

// Error handling types
export interface SafeApiCallOptions {
  fallback?: unknown;
  timeout?: number;
  retries?: number;
  context?: string;
}

export interface ApiCallResult<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

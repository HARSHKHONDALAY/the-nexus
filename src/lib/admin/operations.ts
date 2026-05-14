export type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  world: string;
  status: string;
  registration_open: boolean;
  allow_walk_ins: boolean;
  venue_name: string;
  venue_address?: string | null;
  city: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  ticketPricePaise: number;
  venueCostPaise: number;
  registrations: number;
  checkedIn: number;
  revenuePaise: number;
  expensePaise: number;
  profitPaise: number;
  created_at: string;
  updated_at: string;
};

export type Attendee = {
  bookingId: string;
  ticketId: string | null;
  ticketCode: string | null;
  eventId: string;
  eventTitle: string;
  name: string;
  phone?: string | null;
  email: string;
  source: string;
  instagram?: string | null;
  age?: number | null;
  privacyConsent: boolean;
  mediaConsent: boolean;
  paymentMethod?: string | null;
  amountPaidPaise: number;
  bookingStatus: string;
  checkInStatus: string;
  checkedInAt?: string | null;
  registration_time: string;
  notes?: string | null;
};

export type AuditLog = {
  id: string;
  actor: string;
  entityType: string;
  entityId?: string | null;
  action: string;
  metadata?: string | null;
  created_at: string;
};

export type Dashboard = {
  status?: "ok" | "partial_failure";
  activeEvents: number;
  totalRegistrations: number;
  checkedIn: number;
  revenuePaise: number;
  venueCostPaise: number;
  expensePaise: number;
  profitPaise: number;
  currentEvents: AdminEvent[];
  recentActivity: AuditLog[];
  alerts?: string[];
  unavailableServices?: string[];
};

export type FinanceEntry = {
  id: string;
  eventId?: string | null;
  eventTitle: string;
  entryType: string;
  amountPaise: number;
  note?: string | null;
  created_by: string;
  created_at: string;
};

export type FinanceSummary = {
  totalRevenuePaise: number;
  totalVenueCostPaise: number;
  totalExpensePaise: number;
  totalRefundPaise: number;
  totalProfitPaise: number;
  events: AdminEvent[];
  entries: FinanceEntry[];
};

export type PlatformAnalytics = {
  totalEvents: number;
  confirmedBookings: number;
  grossRevenuePaise: number;
};

type Envelope<T> = { data?: T; message?: string; success?: boolean };
type ErrorEnvelope = {
  message?: string;
  endpoint?: string;
  status?: number;
  method?: string;
  backendMessage?: string;
};

export class AdminRequestError extends Error {
  endpoint: string;
  status: number;
  method: string;
  backendMessage?: string;

  constructor({
    message,
    endpoint,
    status,
    method,
    backendMessage,
  }: {
    message: string;
    endpoint: string;
    status: number;
    method: string;
    backendMessage?: string;
  }) {
    super(message);
    this.name = "AdminRequestError";
    this.endpoint = endpoint;
    this.status = status;
    this.method = method;
    this.backendMessage = backendMessage;
  }
}

export function formatMoney(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  // Check if the date is valid
  if (!isFinite(date.getTime())) {
    return "Invalid Date";
  }
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path.slice(1) : path;
}

function requestMethod(init?: RequestInit) {
  return (init?.method ?? "GET").toUpperCase();
}

async function parseResponseBody<T>(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as Envelope<T> | ErrorEnvelope;
  } catch {
    return { message: text } satisfies ErrorEnvelope;
  }
}

function buildAdminError(
  body: ErrorEnvelope | Envelope<unknown> | null,
  endpoint: string,
  status: number,
  method: string,
  fallback: string,
) {
  const backendMessage = typeof body?.message === "string" ? body.message : undefined;
  const endpointOverride = body && "endpoint" in body && typeof body.endpoint === "string" ? body.endpoint : endpoint;
  const statusOverride = body && "status" in body && typeof body.status === "number" ? body.status : status;
  const methodOverride = body && "method" in body && typeof body.method === "string" ? body.method : method;
  const message = backendMessage && backendMessage !== "Unexpected backend error."
    ? backendMessage
    : `${method} ${endpoint} failed with ${status}. ${fallback}`;

  return new AdminRequestError({
    message,
    endpoint: endpointOverride,
    status: statusOverride,
    method: methodOverride,
    backendMessage,
  });
}

export function formatAdminError(error: unknown, fallback = "Admin request failed.") {
  if (error instanceof AdminRequestError) {
    return `${error.message}${error.backendMessage && error.backendMessage !== error.message ? ` Backend says: ${error.backendMessage}` : ""}`;
  }

  return error instanceof Error ? error.message : fallback;
}

export async function adminProxyApi<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = normalizePath(path);
  const endpoint = `/api/admin/${normalizedPath}`;
  const method = requestMethod(init);

  let response: Response;
  try {
    // Explicitly handle FormData to ensure proper multipart content type
    const isFormData = init?.body instanceof FormData;
    const headers: Record<string, string> = { ...(init?.headers as Record<string, string> ?? {}) };
    
    // Remove any Content-Type header for FormData to let browser set it with boundary
    if (isFormData && headers['Content-Type']) {
      delete headers['Content-Type'];
    } else if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    
    response = await fetch(endpoint, {
      ...init,
      credentials: "same-origin",
      headers,
    });
  } catch {
    throw new AdminRequestError({
      message: `${method} ${endpoint} could not reach the admin gateway.`,
      endpoint,
      status: 0,
      method,
    });
  }

  const body = await parseResponseBody<T>(response);

  if (!response.ok) {
    throw buildAdminError(
      body,
      endpoint,
      response.status,
      method,
      "The admin backend returned an error response.",
    );
  }

  if (!body || typeof body !== "object" || !("data" in body)) {
    throw new AdminRequestError({
      message: `${method} ${endpoint} returned an invalid response shape.`,
      endpoint,
      status: response.status,
      method,
    });
  }

  return (body as Envelope<T>).data as T;
}

export async function adminApi<T>(path: string, init?: RequestInit): Promise<T> {
  return adminProxyApi<T>(`operations/admin${path}`, init);
}

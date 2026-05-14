import { db } from "@/lib/db/client";
import type { BookingStatus } from "@/lib/types/prisma-enums";

interface Booking {
  id: string;
  status: BookingStatus;
  amount_paise: number;
}

interface FinanceEntry {
  id: string;
  amount_paise: number;
}
import { financeAdjustmentSchema, type FinanceAdjustmentInput } from "@/lib/validators/admin";
import { writeAuditLog } from "./audit-service";

export async function listFinanceAdjustments(eventId?: string) {
  return db.finance_entries.findMany({
    where: eventId ? { event_id: eventId } : undefined,
    include: { platform_events: true },
    orderBy: { created_at: "desc" },
  });
}

export async function createFinanceAdjustment(input: FinanceAdjustmentInput) {
  const data = financeAdjustmentSchema.parse(input);
  const adjustment = await db.finance_entries.create({ data });
  await writeAuditLog({ entity_id: adjustment.event_id || undefined, action: "finance.adjustment_created", metadata: `${adjustment.entry_type}: ${adjustment.amount_paise}` });
  return adjustment;
}

export async function getEventFinanceSummary(eventId: string) {
  const event = await db.platform_events.findUniqueOrThrow({
    where: { id: eventId },
    include: { bookings: true, finance_entries: true },
  });
  const verifiedRevenue = event.bookings.filter((booking: Booking) => booking.status === "CONFIRMED").reduce((sum: number, booking: Booking) => sum + Number(booking.amount_paise), 0);
  const adjustmentTotal = event.finance_entries.reduce((sum: number, entry: FinanceEntry) => sum + Number(entry.amount_paise), 0);

  return {
    eventId: event.id,
    verifiedRevenue,
    venueCost: Number(event.venue_cost_paise),
    adjustmentTotal,
    projectedNet: verifiedRevenue + adjustmentTotal - Number(event.venue_cost_paise),
  };
}

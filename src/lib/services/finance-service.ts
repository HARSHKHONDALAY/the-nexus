import { db } from "@/lib/db/client";
import { signedAdjustmentAmount } from "@/lib/utils/finance";
import { financeAdjustmentSchema, type FinanceAdjustmentInput } from "@/lib/validators/admin";
import { writeAuditLog } from "./audit-service";

type FinanceSummaryRegistration = {
  paymentStatus: string;
};

type FinanceSummaryAdjustment = {
  amount: unknown;
  operator: "ADD" | "SUBTRACT";
  section: "REVENUE" | "VENUE_COST" | "EXPENSE" | "REFUND" | "OPERATIONS" | "DISCOUNT";
};

export async function listFinanceAdjustments(eventId?: string) {
  return db.financeAdjustment.findMany({
    where: eventId ? { eventId } : undefined,
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createFinanceAdjustment(input: FinanceAdjustmentInput) {
  const data = financeAdjustmentSchema.parse(input);
  const adjustment = await db.financeAdjustment.create({ data });
  await writeAuditLog({ eventId: adjustment.eventId, actionKey: "finance.adjustment_created", actionLabel: "Finance adjustment created", details: `${adjustment.section}: ${adjustment.amount}` });
  return adjustment;
}

export async function getEventFinanceSummary(eventId: string) {
  const event = await db.event.findUniqueOrThrow({
    where: { id: eventId },
    include: { registrations: true, financeAdjustments: true },
  });
  const verifiedRevenue = event.registrations.filter((registration: FinanceSummaryRegistration) => registration.paymentStatus === "VERIFIED").length * Number(event.price);
  const adjustmentTotal = event.financeAdjustments.reduce((sum: number, adjustment: FinanceSummaryAdjustment) => sum + signedAdjustmentAmount(Number(adjustment.amount), adjustment.operator, adjustment.section), 0);

  return {
    eventId: event.id,
    verifiedRevenue,
    venueCost: Number(event.venueCost),
    adjustmentTotal,
    projectedNet: verifiedRevenue + adjustmentTotal - Number(event.venueCost),
  };
}

import type { FinanceAdjustmentOperator, FinanceAdjustmentSection } from "@prisma/client";

export function signedAdjustmentAmount(amount: number, operator: FinanceAdjustmentOperator, section: FinanceAdjustmentSection) {
  const expenseSections: FinanceAdjustmentSection[] = ["VENUE_COST", "EXPENSE", "REFUND", "DISCOUNT"];
  const base = operator === "SUBTRACT" || expenseSections.includes(section) ? -Math.abs(amount) : Math.abs(amount);
  return base;
}

export function occupancyPercent(registrations: number, maxSeats: number) {
  if (!maxSeats) return 0;
  return Math.min(100, Math.round((registrations / maxSeats) * 100));
}

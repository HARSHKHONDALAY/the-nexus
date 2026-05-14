import type { FinanceEntryType } from "@/lib/types/prisma-enums";

export function signedAdjustmentAmount(amount: number, operator: "ADD" | "SUBTRACT", section: FinanceEntryType) {
  const expenseSections: FinanceEntryType[] = ["EXPENSE", "REFUND"];
  const base = operator === "SUBTRACT" || expenseSections.includes(section) ? -Math.abs(amount) : Math.abs(amount);
  return base;
}

export function occupancyPercent(registrations: number, maxSeats: number) {
  if (!maxSeats) return 0;
  return Math.min(100, Math.round((registrations / maxSeats) * 100));
}

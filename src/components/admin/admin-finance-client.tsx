"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminButton, AdminCard, AdminHeader, EmptyState, MetricCard, PremiumTable, StatusChip } from "@/components/admin/admin-ui";
import { adminApi, formatAdminError, type AdminEvent, type FinanceSummary, formatDateTime, formatMoney } from "@/lib/admin/operations";

export default function AdminFinanceClient() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [entry, setEntry] = useState({ eventId: "", entryType: "EXPENSE", amount: "", note: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    setSummary(await adminApi<FinanceSummary>("/finance"));
  };

  useEffect(() => {
    let alive = true;
    async function loadInitial() {
      try {
        const data = await adminApi<FinanceSummary>("/finance");
        if (alive) setSummary(data);
      } catch (reason) {
        if (alive) setMessage(formatAdminError(reason, "Unable to load finance."));
      }
    }
    void loadInitial();
    return () => {
      alive = false;
    };
  }, []);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      await adminApi("/finance/entries", {
        method: "POST",
        body: JSON.stringify({
          eventId: entry.eventId || null,
          entryType: entry.entryType,
          amountPaise: Math.round(Number(entry.amount) * 100),
          note: entry.note,
        }),
      });
      setEntry({ eventId: "", entryType: "EXPENSE", amount: "", note: "" });
      await load();
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to add finance entry."));
    }
  }

  async function remove(id: string) {
    try {
      await adminApi(`/finance/entries/${id}`, { method: "DELETE" });
      await load();
    } catch (reason) {
      setMessage(formatAdminError(reason, "Unable to delete finance entry."));
    }
  }

  return (
    <>
      <AdminHeader eyebrow="Super Admin Finance" title="Money movement with audit-grade memory." description="Revenue, venue cost, expenses, refunds, manual adjustments, event-level profit, and global ecosystem health from live backend data." />
      {message ? <AdminCard className="mb-5 text-amber-100">{message}</AdminCard> : null}
      {!summary ? <EmptyState title="Loading finance." detail="Reading persisted revenue, costs, and adjustment history." /> : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Revenue" value={formatMoney(summary.totalRevenuePaise)} detail="Confirmed and manual revenue." />
            <MetricCard label="Venue Costs" value={formatMoney(summary.totalVenueCostPaise)} detail="Event venue commitments." tone="amber" />
            <MetricCard label="Expenses" value={formatMoney(summary.totalExpensePaise)} detail="Operational spend." tone="blue" />
            <MetricCard label="Refunds" value={formatMoney(summary.totalRefundPaise)} detail="Tracked refunds." tone="rose" />
            <MetricCard label="Profit" value={formatMoney(summary.totalProfitPaise)} detail="Net platform result." tone={summary.totalProfitPaise >= 0 ? "lime" : "rose"} />
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.8fr]">
            <AdminCard>
              <p className="text-xs uppercase tracking-[0.3em] text-lime-100/42">Event-wise Finance</p>
              <div className="mt-6 space-y-4">
                {summary.events.length === 0 ? <EmptyState title="No event finance yet." detail="Create events and add entries to begin tracking profit." /> : summary.events.map((event: AdminEvent) => (
                  <div key={event.id} className="rounded-3xl border border-lime-200/12 bg-black/24 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-lime-50">{event.title}</h3>
                        <p className="mt-1 text-sm text-lime-100/48">{event.venueName}</p>
                      </div>
                      <StatusChip tone={event.profitPaise >= 0 ? "lime" : "red"}>{formatMoney(event.profitPaise)} profit</StatusChip>
                    </div>
                    <div className="mt-5 grid gap-3 text-sm text-lime-100/62 sm:grid-cols-4">
                      <span>Revenue {formatMoney(event.revenuePaise)}</span>
                      <span>Venue {formatMoney(event.venueCostPaise)}</span>
                      <span>Expense {formatMoney(event.expensePaise)}</span>
                      <span>{event.registrations} registrations</span>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>

            <AdminCard>
              <p className="text-xs uppercase tracking-[0.3em] text-lime-100/42">Add Finance Entry</p>
              <form onSubmit={add} className="mt-5 grid gap-4">
                <select value={entry.eventId} onChange={(event) => setEntry({ ...entry, eventId: event.target.value })} className="h-12 rounded-2xl border border-lime-200/14 bg-black/30 px-4 text-lime-50 outline-none">
                  <option value="">Global entry</option>
                  {summary.events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
                </select>
                <select value={entry.entryType} onChange={(event) => setEntry({ ...entry, entryType: event.target.value })} className="h-12 rounded-2xl border border-lime-200/14 bg-black/30 px-4 text-lime-50 outline-none">
                  {["REVENUE", "EXPENSE", "VENUE_COST", "REFUND", "MISC"].map((type) => <option key={type}>{type}</option>)}
                </select>
                <input required type="number" placeholder="Amount INR" value={entry.amount} onChange={(event) => setEntry({ ...entry, amount: event.target.value })} className="h-12 rounded-2xl border border-lime-200/14 bg-black/30 px-4 text-lime-50 outline-none" />
                <textarea rows={4} placeholder="Notes/comments" value={entry.note} onChange={(event) => setEntry({ ...entry, note: event.target.value })} className="rounded-2xl border border-lime-200/14 bg-black/30 px-4 py-3 text-lime-50 outline-none" />
                <AdminButton type="submit">Add Entry</AdminButton>
              </form>
            </AdminCard>
          </section>

          <AdminCard className="mt-5">
            <p className="text-xs uppercase tracking-[0.3em] text-lime-100/42">Adjustment History</p>
            <div className="mt-6">
              <PremiumTable
                columns={["Type", "Event", "Amount", "Operator", "Time", "Note", "Action"]}
                rows={summary.entries.map((item) => [
                  <StatusChip key="type" tone={item.entryType === "REVENUE" ? "lime" : item.entryType === "REFUND" ? "red" : "amber"}>{item.entryType}</StatusChip>,
                  <span key="event">{item.eventTitle}</span>,
                  <span key="amount">{formatMoney(item.amountPaise)}</span>,
                  <span key="operator">{item.createdBy}</span>,
                  <span key="time">{formatDateTime(item.createdAt)}</span>,
                  <span key="note" className="text-lime-100/58">{item.note || "-"}</span>,
                  <AdminButton key="delete" variant="ghost" onClick={() => remove(item.id)}>Delete</AdminButton>,
                ])}
              />
            </div>
          </AdminCard>
        </>
      )}
    </>
  );
}

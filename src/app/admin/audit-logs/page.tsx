"use client";

import { useEffect, useState } from "react";

import { AdminCard, AdminHeader, EmptyState, StatusChip } from "@/components/admin/admin-ui";
import { adminApi, formatAdminError, type AuditLog, formatDateTime } from "@/lib/admin/operations";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi<AuditLog[]>("/audit-logs")
      .then(setLogs)
      .catch((reason) => setError(formatAdminError(reason, "Unable to load audit logs.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader eyebrow="Operational Memory" title="Every backstage action, preserved in sequence." description="Audit history is now written by real backend mutations across events, finance, attendees, and check-ins." />
      {error ? <AdminCard className="mb-5 text-amber-100">{error}</AdminCard> : null}
      <AdminCard>
        <div className="space-y-6">
          {loading ? <EmptyState title="Loading audit logs." detail="Fetching backend audit history." /> : logs.length === 0 ? <EmptyState title="No audit logs yet." detail="Operational activity will appear here as admins create events, add walk-ins, and manage finance." /> : logs.map((log) => (
            <div key={log.id} className="relative grid gap-4 border-l border-lime-300/24 pl-6 md:grid-cols-[220px_1fr]">
              <span className="absolute -left-2 top-1 h-4 w-4 rounded-full border border-lime-200/30 bg-lime-300 shadow-[0_0_25px_rgba(56,189,248,0.45)]" />
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-lime-100/42">{formatDateTime(log.createdAt)}</p>
                <p className="mt-2 text-sm text-lime-100/58">{log.actor}</p>
              </div>
              <div className="rounded-3xl border border-lime-200/12 bg-black/24 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusChip tone="blue">{log.action}</StatusChip>
                  <StatusChip tone="neutral">{log.entityType}</StatusChip>
                </div>
                <p className="mt-4 text-sm leading-6 text-lime-100/56">{log.metadata || "No metadata"}</p>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </>
  );
}

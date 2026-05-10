"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, CalendarClock } from "lucide-react";

import { AdminButton, AdminCard, AdminHeader, EmptyState, MetricCard, StatusChip } from "@/components/admin/admin-ui";
import { adminApi, formatAdminError, type Dashboard, formatDateTime, formatMoney } from "@/lib/admin/operations";
import { useAuth } from "@/lib/auth/client";

export default function AdminDashboardClient() {
  const { user, hasRole } = useAuth();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await adminApi<Dashboard>("/dashboard");
      setDashboard(response);
    } catch (reason) {
      setError(formatAdminError(reason, "Unable to load dashboard."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;

    adminApi<Dashboard>("/dashboard")
      .then((response) => {
        if (!alive) return;
        setDashboard(response);
        setError("");
      })
      .catch((reason) => {
        if (!alive) return;
        setError(formatAdminError(reason, "Unable to load dashboard."));
      })
      .finally(() => {
        if (alive) setIsLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const isSuperAdmin = hasRole(user, "SUPER_ADMIN");
  const errorTitle = dashboard ? "Live operations are partially degraded." : "Unable to load live operations.";
  const errorDetail = error || "The dashboard could not load operational data.";

  return (
    <>
      <AdminHeader
        eyebrow={isSuperAdmin ? "Founder Command" : "Live Event Floor"}
        title={isSuperAdmin ? "Ecosystem operations, financially accountable." : "Assigned event operations, ready for the floor."}
        description={isSuperAdmin ? "Platform-level visibility across live events, registrations, check-ins, revenue, costs, and profit." : "A fast control surface for check-ins, walk-ins, registrations, and live room readiness."}
      />

      {error ? (
        <AdminCard className="mb-5 border-rose-300/18 bg-rose-300/[0.05] text-rose-50">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-rose-100/60">Operations Feed</p>
              <h3 className="mt-3 font-serif text-3xl tracking-[-0.035em] text-rose-50">{errorTitle}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-rose-100/72">{errorDetail}</p>
            </div>
            <AdminButton onClick={() => void loadDashboard()} disabled={isLoading} className="self-start md:self-auto">
              {isLoading ? "Refreshing" : "Retry Dashboard"}
            </AdminButton>
          </div>
        </AdminCard>
      ) : null}
      {!error && dashboard?.status === "partial_failure" && (dashboard.alerts?.length ?? 0) > 0 ? (
        <AdminCard className="mb-5 text-amber-100">
          {dashboard.alerts?.join(" ")}
        </AdminCard>
      ) : null}
      {isLoading && !dashboard ? <EmptyState title="Loading live operations." detail="Fetching real backend state from the Nexus operations API." /> : !dashboard ? <EmptyState title="Dashboard unavailable." detail={error || "The control room is online, but the live metrics feed is still reconnecting."} /> : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Active Events" value={String(dashboard.activeEvents)} detail="Current draft, published, and live rooms." />
            <MetricCard label="Registrations" value={String(dashboard.totalRegistrations)} detail={`${dashboard.checkedIn} checked in so far.`} tone="blue" />
            <MetricCard label={isSuperAdmin ? "Revenue" : "Check-in Pulse"} value={isSuperAdmin ? formatMoney(dashboard.revenuePaise) : `${dashboard.checkedIn}/${dashboard.totalRegistrations}`} detail={isSuperAdmin ? "Confirmed booking revenue." : "Live attendee movement."} tone="amber" />
            <MetricCard label={isSuperAdmin ? "Profit" : "Room State"} value={isSuperAdmin ? formatMoney(dashboard.profitPaise) : "Ready"} detail={isSuperAdmin ? "Revenue after venue and expenses." : "Operational surface connected."} tone={dashboard.profitPaise >= 0 ? "lime" : "rose"} />
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <AdminCard>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-lime-100/42">Event Health</p>
                  <h3 className="mt-3 font-serif text-3xl tracking-[-0.035em] text-lime-50">Current rooms</h3>
                </div>
                <Activity className="text-lime-200/60" />
              </div>
              <div className="mt-7 space-y-4">
                {dashboard.currentEvents.length === 0 ? <EmptyState title="No current events." detail="Create your first Chess Nexus or Art Nexus event to begin operations." /> : dashboard.currentEvents.map((event) => (
                  <div key={event.id} className="rounded-[1.5rem] border border-lime-200/10 bg-black/26 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold text-lime-50">{event.title}</h4>
                        <p className="mt-1 text-sm text-lime-100/52">{formatDateTime(event.startsAt)} · {event.venueName}</p>
                      </div>
                      <StatusChip tone={event.status === "LIVE" ? "lime" : "blue"}>{event.status}</StatusChip>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-lime-200/10">
                      <div className="h-full rounded-full bg-lime-300" style={{ width: `${event.capacity ? Math.min((event.registrations / event.capacity) * 100, 100) : 0}%` }} />
                    </div>
                    <div className="mt-4 grid gap-3 text-sm text-lime-100/58 sm:grid-cols-3">
                      <span>{event.registrations} registrations</span>
                      <span>{event.checkedIn} checked in</span>
                      <span>{formatMoney(event.profitPaise)} profit</span>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>

            <AdminCard>
              <div className="flex items-center gap-3">
                <CalendarClock size={18} className="text-lime-200" />
                <p className="text-xs uppercase tracking-[0.3em] text-lime-100/42">Recent Activity</p>
              </div>
              <div className="mt-6 space-y-5">
                {dashboard.recentActivity.length === 0 ? <p className="text-sm text-lime-100/52">No audit activity yet.</p> : dashboard.recentActivity.map((log) => (
                  <div key={log.id} className="border-l border-lime-300/24 pl-4">
                    <p className="text-sm font-medium text-lime-50">{log.action}</p>
                    <p className="mt-1 text-xs leading-5 text-lime-100/50">{log.actor} · {formatDateTime(log.createdAt)}</p>
                  </div>
                ))}
              </div>
            </AdminCard>
          </section>
        </>
      )}
    </>
  );
}

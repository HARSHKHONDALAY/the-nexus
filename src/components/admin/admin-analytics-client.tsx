"use client";

import { useEffect, useState } from "react";

import { AdminCard, AdminHeader, EmptyState, MetricCard } from "@/components/admin/admin-ui";
import { adminProxyApi, formatAdminError, formatMoney, type PlatformAnalytics } from "@/lib/admin/operations";

export default function AdminAnalyticsClient() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    adminProxyApi<PlatformAnalytics>("analytics/admin/platform")
      .then((response) => {
        if (!alive) return;
        setAnalytics(response);
      })
      .catch((reason) => {
        if (!alive) return;
        setError(formatAdminError(reason, "Unable to load platform analytics."));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <AdminHeader
        eyebrow="Platform Analytics"
        title="Founder-level signal across the ecosystem."
        description="Platform-wide event, booking, and revenue metrics from the live Spring analytics service."
      />

      {error ? <AdminCard className="mb-5 text-amber-100">{error}</AdminCard> : null}

      {loading && !analytics ? (
        <EmptyState title="Loading analytics." detail="Querying the backend analytics service." />
      ) : !analytics ? (
        <EmptyState title="Analytics unavailable." detail={error || "The analytics service did not return a usable response."} />
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Total Events" value={String(analytics.totalEvents)} detail="All platform events in the system." />
          <MetricCard label="Confirmed Bookings" value={String(analytics.confirmedBookings)} detail="Bookings that completed successfully." tone="blue" />
          <MetricCard label="Gross Revenue" value={formatMoney(analytics.grossRevenuePaise)} detail="Captured platform revenue." tone="amber" />
        </section>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CalendarDays, Camera, CircleDollarSign, ClipboardList, LineChart, LogOut, Settings, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/client";
import { hasAnyPermission } from "@/lib/auth/roles";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3, permissions: [] },
  { label: "Events", href: "/admin/events", icon: CalendarDays, permissions: ["events.manage"] },
  { label: "Attendees", href: "/admin/attendees", icon: Users, permissions: ["registrations.read"] },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart, permissions: ["analytics.read"] },
  { label: "Finance", href: "/admin/finance", icon: CircleDollarSign, permissions: ["finance.read"] },
  { label: "Moments", href: "/admin/moments", icon: Camera, permissions: ["moments.manage"] },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList, permissions: ["audit.read"] },
  { label: "Settings", href: "/admin/settings", icon: Settings, permissions: ["admin.manage", "permissions.manage"] },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, status, hasRole } = useAuth();
  const isSuperAdmin = hasRole(user, "SUPER_ADMIN");
  const dashboardHref = isSuperAdmin ? "/super-admin/dashboard" : "/admin/dashboard";
  const resolveHref = (href: string) => {
    if (!isSuperAdmin) return href;
    return href === "/admin/dashboard" ? "/super-admin/dashboard" : href;
  };
  const visibleNavItems = navItems
    .filter((item) => item.permissions.length === 0 || hasAnyPermission(user, item.permissions))
    .map((item) => ({ ...item, href: resolveHref(item.href) }));

  useEffect(() => {
    if (pathname !== "/admin/login" && status === "anonymous") {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, status]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#020817] text-lime-50">
        <div className="rounded-[2rem] border border-lime-200/14 bg-lime-200/[0.04] p-8 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-lime-100/50">Verifying operator session</p>
          <p className="mt-3 font-serif text-3xl">Preparing the control room.</p>
        </div>
      </div>
    );
  }

  if (status === "anonymous") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#020817] text-lime-50">
        <div className="rounded-[2rem] border border-lime-200/14 bg-lime-200/[0.04] p-8 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-lime-100/50">Session required</p>
          <p className="mt-3 font-serif text-3xl">Redirecting to admin login.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#020817] text-lime-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_90%_12%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(135deg,rgba(56,189,248,0.05),transparent_42%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[292px_1fr]">
        <nav className="sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-lime-200/12 bg-black/72 px-5 py-3 backdrop-blur-2xl lg:hidden" aria-label="Admin sections">
          {visibleNavItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs transition",
                  active ? "border-lime-300 bg-lime-300 text-black" : "border-lime-200/14 bg-lime-200/[0.04] text-lime-100/68",
                )}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <aside className="hidden border-r border-lime-200/12 bg-black/35 p-5 backdrop-blur-2xl lg:block">
          <div className="sticky top-5 flex h-[calc(100vh-40px)] flex-col rounded-[2rem] border border-lime-200/14 bg-lime-200/[0.035] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <Link href={dashboardHref} className="rounded-[1.5rem] border border-lime-200/12 bg-black/30 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 text-black shadow-[0_0_35px_rgba(56,189,248,0.32)]">
                  <Sparkles size={18} />
                </span>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.38em] text-lime-100/45">The Nexus</p>
                  <h1 className="font-serif text-xl tracking-tight text-lime-50">Ops Control</h1>
                </div>
              </div>
            </Link>

            <nav className="mt-7 space-y-2">
              {visibleNavItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition duration-300",
                      active ? "bg-lime-300 text-black shadow-[0_0_34px_rgba(56,189,248,0.2)]" : "text-lime-100/58 hover:bg-lime-200/[0.07] hover:text-lime-50",
                    )}
                  >
                    {active ? <motion.span layoutId="admin-active-pill" className="absolute inset-0 rounded-2xl" /> : null}
                    <Icon size={17} className="relative z-10" />
                    <span className="relative z-10 font-medium tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-[1.5rem] border border-lime-200/12 bg-black/30 p-4">
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-lime-100/38">Live Room State</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-lime-50">Operational</span>
                <span className="rounded-full bg-lime-300/14 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-lime-200">Synced</span>
              </div>
              <div className="mt-4 border-t border-lime-200/10 pt-4">
                <p className="truncate text-sm text-lime-50">{user?.fullName ?? "Authenticated operator"}</p>
                <p className="mt-1 text-xs text-lime-100/42">{user?.roles?.join(" + ")}</p>
                <button onClick={logout} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-lime-200/14 bg-lime-200/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-lime-100/68 transition hover:bg-lime-200/[0.08]">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="relative px-5 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

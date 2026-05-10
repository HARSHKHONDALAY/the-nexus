import type { Metadata } from "next";
import AdminShell from "@/components/admin/admin-shell";
import { AuthProvider } from "@/lib/auth/client";
import { currentPathname, requireServerUser } from "@/lib/auth/server";
import { adminRoutePermissions } from "@/lib/auth/roles";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noIndexMetadata(
  "Admin OS | The Nexus",
  "A private backstage operating system for premium event experiences.",
);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = await currentPathname();
  if (pathname !== "/admin/login") {
    const matchedPermission = Object.entries(adminRoutePermissions).find(
      ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
    await requireServerUser({
      roles: ["SUPER_ADMIN", "CHESS_NEXUS_ADMIN", "ART_NEXUS_ADMIN"],
      permissions: matchedPermission?.[1],
    });
  }

  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}

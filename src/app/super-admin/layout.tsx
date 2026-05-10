import AdminShell from "@/components/admin/admin-shell";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/client";
import { requireServerUser } from "@/lib/auth/server";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noIndexMetadata(
  "Super Admin OS | The Nexus",
  "A private founder-level control surface for The Nexus.",
);

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  await requireServerUser({ superAdminOnly: true });

  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}

import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/client";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noIndexMetadata("Login | The Nexus");

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

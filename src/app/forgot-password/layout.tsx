import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noIndexMetadata("Forgot Password | The Nexus");

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}

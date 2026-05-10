import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noIndexMetadata("Session Expired | The Nexus");

export default function SessionExpiredLayout({ children }: { children: React.ReactNode }) {
  return children;
}

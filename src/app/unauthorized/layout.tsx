import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noIndexMetadata("Unauthorized | The Nexus");

export default function UnauthorizedLayout({ children }: { children: React.ReactNode }) {
  return children;
}

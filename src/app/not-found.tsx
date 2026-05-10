import Link from "next/link";
import type { Metadata } from "next";

import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import SectionWrapper from "@/components/layout/section-wrapper";
import { Button } from "@/components/shared/button";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noIndexMetadata("Page Not Found | The Nexus");

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <SectionWrapper spacing="relaxed" blendTop blendBottom>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45">404</p>
            <h1 className="mt-7 font-serif text-[2.6rem] leading-[0.93] tracking-[-0.03em] text-lime-50 md:text-[4.8rem]">
              This room does not exist.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lime-100/62">
              The link may be outdated, private, or moved into another world.
            </p>
            <div className="mt-10">
              <Button asChild variant="primary" size="roomy">
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <FooterEcosystem />
    </>
  );
}

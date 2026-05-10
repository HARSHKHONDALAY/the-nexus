"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/shared/button";
import { getPublicEvents } from "@/lib/api/events";

const footerGroups = [
  {
    title: "Ecosystem",
    links: [
      { label: "Home", href: "/" },
      { label: "Events", href: "/events" },
      { label: "Moments", href: "/moments" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Institution",
    links: [
      { label: "About", href: "/about" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

export default function FooterEcosystem() {
  // Static fallback values for now - will be updated by parent component
  const eventTitle = "Checkmate & Chaos";
  const eventSlug = "checkmate-chaos";

  return (
    <footer className="relative overflow-hidden border-t border-lime-200/15 bg-black pb-24 pt-18 md:pb-10 md:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-lime-300/10 blur-[90px]" />
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-12 md:grid-cols-12"
        >
          <div className="md:col-span-5">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-lime-100/45">
              The Nexus
            </p>
            <h2 className="mt-5 max-w-[18ch] text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-lime-50 md:text-[3.1rem]">
              A premium cultural institution for modern experiential rooms.
            </h2>
            <p className="mt-5 max-w-[42ch] text-[0.98rem] leading-7 text-lime-100/62">
              Curated rooms. Emotional architecture. Experiences designed to
              make people feel: I belong here.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
                <Link href={`/register/${eventSlug}`}>Book Tickets</Link>
              </Button>
              <Button asChild variant="secondary" size="roomy">
                <Link href="/events">Explore Events</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:col-span-7">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-lime-100/45">
                  {group.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[0.96rem] text-lime-100/70 transition-colors duration-300 hover:text-lime-50"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-14 border-t border-lime-200/15 pt-6 text-[0.66rem] uppercase tracking-[0.18em] text-lime-100/70">
          The Nexus {new Date().getFullYear()} - Belonging, curated.
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const footerGroups = [
  {
    title: "Ecosystem",
    links: [
      { label: "Home", href: "/" },
      { label: "Events", href: "/events" },
      { label: "Worlds", href: "/worlds" },
      { label: "Moments", href: "/moments" },
      { label: "Join", href: "/join" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Culture Worlds",
    links: [
      { label: "The Chess Nexus", href: "/worlds/chess-nexus" },
      { label: "The Art Nexus", href: "/worlds/art-nexus" },
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
  return (
    <footer className="relative overflow-hidden border-t border-lime-200/15 bg-black pb-10 pt-20 md:pt-24">
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
            <p className="text-xs uppercase tracking-[0.4em] text-lime-100/45">
              The Nexus
            </p>
            <h2 className="mt-6 max-w-[18ch] text-3xl font-semibold leading-tight tracking-tight text-lime-50 md:text-4xl">
              A premium cultural institution for modern youth worlds.
            </h2>
            <p className="mt-6 max-w-[44ch] text-sm leading-relaxed text-lime-100/62 md:text-base">
              Curated rooms. Emotional architecture. Experiences designed to
              make people feel: I belong here.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 md:col-span-7">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs uppercase tracking-[0.3em] text-lime-100/45">
                  {group.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-lime-100/70 transition-colors duration-300 hover:text-lime-50"
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

        <div className="mt-16 border-t border-lime-200/15 pt-6 text-xs uppercase tracking-[0.24em] text-lime-100/38">
          The Nexus {new Date().getFullYear()} - Belonging, curated.
        </div>
      </div>
    </footer>
  );
}

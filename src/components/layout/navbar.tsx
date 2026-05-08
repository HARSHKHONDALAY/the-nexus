"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/shared/button";
import { events } from "@/lib/events";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const links = [
    { label: "Worlds", href: "/worlds" },
    { label: "Moments", href: "/moments" },
    { label: "About", href: "/about" },
    { label: "Join", href: "/join" },
    { label: "Contact", href: "/contact" },
  ];

  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (href: string) => pathname === href;
  const isEventsActive = pathname === "/events" || pathname.startsWith("/events/");

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/90 via-black/55 to-transparent" />

      <div className="container-custom relative">
        <div className="tone-panel mt-4 rounded-2xl px-5 backdrop-blur-2xl md:px-8">
          <div className="flex h-[4.5rem] items-center justify-between md:h-20">
            <Link href="/" className="group">
              <span className="block text-[0.64rem] uppercase tracking-[0.42em] text-lime-100/48 transition group-hover:text-lime-50/90">
                Culture House
              </span>
              <h1 className="font-serif text-lg tracking-[0.02em] text-lime-50 md:text-[1.28rem]">
                The Nexus
              </h1>
            </Link>

            <nav className="hidden items-center gap-10 text-xs uppercase tracking-[0.2em] text-lime-100/64 md:flex">
              <Link
                href="/"
                className={`relative py-2 transition ${
                  pathname === "/" ? "text-lime-50" : "hover:text-lime-50"
                }`}
              >
                Home
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setIsEventsOpen(true)}
                onMouseLeave={() => setIsEventsOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsEventsOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={isEventsOpen}
                  className={`inline-flex items-center gap-2 py-2 transition ${
                    isEventsActive ? "text-lime-50" : "hover:text-lime-50"
                  }`}
                >
                  Events <ChevronDown size={14} className="opacity-70" />
                </button>

                {isEventsOpen ? (
                  <div
                    role="menu"
                    className="absolute left-0 top-full mt-3 w-[360px] overflow-hidden rounded-2xl border border-lime-300/26 bg-black/90 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
                  >
                    <Link
                      role="menuitem"
                      href="/events"
                      className="block rounded-xl border border-lime-300/18 bg-lime-300/[0.06] px-4 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-lime-50 transition hover:border-lime-300/35 hover:bg-lime-300/[0.12]"
                    >
                      View All Experiences
                    </Link>

                    <div className="mt-3">
                      <p className="px-2 py-2 text-[0.62rem] uppercase tracking-[0.28em] text-lime-100/55">
                        Event Pages
                      </p>
                      <div className="space-y-1">
                        {events.map((event) => (
                          <Link
                            key={event.slug}
                            role="menuitem"
                            href={`/events/${event.slug}`}
                            className="block rounded-xl px-3 py-3 transition hover:bg-lime-300/[0.12]"
                          >
                            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-lime-50">
                              {event.title}
                            </p>
                            <p className="mt-1 text-[0.68rem] text-lime-100/62">
                              {event.world} · {event.date}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative py-2 transition ${
                    isActive(link.href) ? "text-lime-50" : "hover:text-lime-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="compact"
                className="hidden uppercase tracking-[0.18em] md:inline-flex"
              >
                Enter Nexus
              </Button>

              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-lime-300/34 bg-lime-300/[0.08] text-lime-50 transition hover:bg-lime-300/[0.14] md:hidden"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="border-t border-lime-300/22 py-4 md:hidden">
              <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 text-sm uppercase tracking-[0.18em] text-lime-100/68 transition hover:bg-lime-300/[0.12] hover:text-lime-50"
                >
                  Home
                </Link>
                <Link
                  href="/events"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 text-sm uppercase tracking-[0.18em] text-lime-100/68 transition hover:bg-lime-300/[0.12] hover:text-lime-50"
                >
                  Events
                </Link>

                <div className="mt-1 rounded-xl border border-lime-300/16 bg-lime-300/[0.04] p-2">
                  <p className="px-2 py-2 text-[0.62rem] uppercase tracking-[0.28em] text-lime-100/60">
                    Event Pages
                  </p>
                  <div className="flex flex-col gap-1">
                    {events.map((event) => (
                      <Link
                        key={event.slug}
                        href={`/events/${event.slug}`}
                        onClick={closeMenu}
                        className="rounded-lg px-2 py-2 transition hover:bg-lime-300/[0.12]"
                      >
                        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-lime-50">
                          {event.title}
                        </p>
                        <p className="mt-1 text-[0.68rem] text-lime-100/62">
                          {event.world}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-xl px-3 py-3 text-sm uppercase tracking-[0.18em] text-lime-100/68 transition hover:bg-lime-300/[0.12] hover:text-lime-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Button
                variant="primary"
                className="mt-4 w-full text-xs font-semibold uppercase tracking-[0.18em]"
              >
                Enter Nexus
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
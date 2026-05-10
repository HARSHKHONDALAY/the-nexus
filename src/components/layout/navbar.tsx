"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/shared/button";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    { label: "Events", href: "/events" },
    { label: "Moments", href: "/moments" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 z-50 w-full transition-all duration-500 ease-out backdrop-blur-xl bg-black/40 supports-[backdrop-filter]:bg-black/30 hover:bg-black/50">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.92),rgba(2,8,23,0.62)_58%,transparent)]" />

      <div className="container-custom relative">
        <div className="relative mt-3 overflow-hidden rounded-2xl border border-cyan-200/12 bg-black/38 px-4 shadow-[0_18px_70px_rgba(8,47,73,0.28)] backdrop-blur-2xl supports-[backdrop-filter]:bg-black/28 md:mt-4 md:px-7">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent animate-pulse-slow" />
          <div className="pointer-events-none absolute -left-12 top-1/2 h-24 w-44 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative flex h-[4.25rem] items-center justify-between gap-4 md:h-20">
            <Link
              href="/"
              className="group relative -ml-1 flex shrink-0 items-center outline-none"
              aria-label="The Nexus home"
              onClick={closeMenu}
            >
              <span className="absolute -inset-3 rounded-full bg-cyan-300/0 blur-2xl transition duration-500 group-hover:bg-cyan-300/16 group-focus-visible:bg-cyan-300/16" />
              <Image
                src="/branding/logo.png"
                alt="The Nexus"
                width={707}
                height={353}
                priority
                sizes="(max-width: 640px) 132px, (max-width: 1024px) 152px, 172px"
                className="relative h-auto w-[132px] object-contain drop-shadow-[0_0_18px_rgba(125,211,252,0.12)] transition duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.025] group-hover:drop-shadow-[0_0_28px_rgba(125,211,252,0.30)] group-focus-visible:-translate-y-0.5 group-focus-visible:scale-[1.025] sm:w-[148px] lg:w-[172px]"
              />
            </Link>

            <nav className="hidden items-center gap-7 text-[0.72rem] uppercase tracking-[0.16em] text-cyan-50/62 lg:flex xl:gap-10">
              <Link
                href="/"
                className={`relative py-2 transition duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-cyan-200/80 after:transition-transform ${
                  pathname === "/" ? "text-cyan-50 after:scale-x-100" : "hover:text-cyan-50 hover:after:scale-x-100"
                }`}
              >
                Home
              </Link>

              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative py-2 transition duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-cyan-200/80 after:transition-transform ${
                    isActive(link.href) ? "text-cyan-50 after:scale-x-100" : "hover:text-cyan-50 hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="primary"
                size="compact"
                className="hidden border-cyan-200/25 bg-cyan-100 text-black shadow-[0_0_32px_rgba(103,232,249,0.20)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_0_42px_rgba(103,232,249,0.34)] md:inline-flex md:text-[0.67rem] md:uppercase md:tracking-[0.18em]"
                endIcon={<ArrowRight size={14} />}
              >
                <Link href="/events">Book Tickets</Link>
              </Button>

              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200/25 bg-cyan-200/[0.08] text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.10)] transition duration-300 hover:bg-cyan-200/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:hidden"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div id="mobile-navigation" className="border-t border-cyan-200/14 py-4 md:hidden">
              <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 text-sm uppercase tracking-[0.18em] text-cyan-50/68 transition hover:bg-cyan-200/[0.10] hover:text-cyan-50"
                >
                  Home
                </Link>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-xl px-3 py-3 text-sm uppercase tracking-[0.18em] text-cyan-50/68 transition hover:bg-cyan-200/[0.10] hover:text-cyan-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Button
                asChild
                variant="primary"
                className="mt-4 w-full bg-cyan-100 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow-[0_0_30px_rgba(103,232,249,0.22)] hover:bg-white"
                endIcon={<ArrowRight size={15} />}
              >
                <Link href="/events" onClick={closeMenu}>Book Tickets</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

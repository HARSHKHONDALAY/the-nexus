"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ShieldCheck, Sparkles } from "lucide-react";

export function AuthScreen({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auraRef.current) return;
    const tween = gsap.to(auraRef.current, {
      rotate: 360,
      scale: 1.08,
      duration: 18,
      repeat: -1,
      ease: "none",
      yoyo: true,
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030611] px-5 py-8 text-white">
      <div ref={auraRef} className="pointer-events-none absolute left-1/2 top-[-22rem] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[conic-gradient(from_120deg,rgba(190,242,100,0.26),rgba(34,211,238,0.18),rgba(255,255,255,0.05),rgba(190,242,100,0.26))] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30" />
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Link href="/" className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70 backdrop-blur-xl">
            <Sparkles size={15} className="text-lime-200" /> The Nexus
          </Link>
          <p className="mt-10 text-xs uppercase tracking-[0.42em] text-lime-100/52">{eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.94] tracking-[-0.045em] text-white md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/58">{description}</p>
          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
            {["JWT secured", "Role aware", "Session synced"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/70 backdrop-blur-xl">
                <ShieldCheck size={17} className="mb-3 text-lime-200" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 34, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1, duration: 0.75 }} className="rounded-[2rem] border border-white/12 bg-white/[0.065] p-5 shadow-[0_35px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          {children}
        </motion.div>
      </section>
    </main>
  );
}

export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-2xl border border-white/12 bg-black/28 px-4 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-lime-200/60 focus:bg-black/38"
    />
  );
}

export function AuthButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button disabled={disabled} className="h-12 w-full rounded-2xl bg-lime-300 text-sm font-bold uppercase tracking-[0.22em] text-black transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-60">
      {children}
    </button>
  );
}

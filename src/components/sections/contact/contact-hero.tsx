"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative isolate min-h-[64vh] overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_74%_24%,rgba(173,216,255,0.1),transparent_34%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />

      <div className="container-custom relative z-10 flex min-h-[64vh] items-end pb-16 pt-36 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <p className="text-xs uppercase tracking-[0.38em] text-lime-100/52 md:text-sm">
            Contact
          </p>
          <h1 className="mt-6 max-w-[16ch] font-serif text-[2.8rem] leading-[0.92] tracking-[-0.03em] text-lime-50 sm:text-[3.8rem] md:text-[5.2rem]">
            Enter the institution. Speak to the house.
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-relaxed text-lime-100/66 md:text-xl">
            For collaborations, partnerships, culture submissions, or community
            inquiries—reach out with intention.
          </p>
        </motion.div>
      </div>
    </section>
  );
}


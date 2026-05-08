"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import Magnetic from "@/components/interactions/magnetic";
import { Button } from "@/components/shared/button";

type FormState = "idle" | "sent";

export default function ContactFormSection() {
  const baseId = useId();
  const [state, setState] = useState<FormState>("idle");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sent");
  };

  return (
    <SectionWrapper
      spacing="default"
      className="border-y border-lime-200/15 bg-black/45"
      blendTop
      blendBottom
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.34em] text-lime-100/48">
            Contact Form
          </p>
          <h3 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-lime-50 md:text-4xl">
            Send a message with intention.
          </h3>
          <p className="mt-6 max-w-[48ch] text-lime-100/62">
            We’re a culture-first house. Clear context helps us respond with the
            right energy.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.35 }}
          className="md:col-span-7"
        >
          <form
            onSubmit={onSubmit}
            className="rounded-[2rem] border border-lime-200/16 bg-lime-200/[0.04] p-7 md:p-10"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/55">
                  Name
                </span>
                <input
                  id={`${baseId}-name`}
                  name="name"
                  required
                  className="h-11 rounded-2xl border border-lime-300/22 bg-black/40 px-4 text-lime-50 outline-none transition focus:border-lime-300/45 focus:ring-2 focus:ring-lime-300/25"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/55">
                  Email
                </span>
                <input
                  id={`${baseId}-email`}
                  name="email"
                  type="email"
                  required
                  className="h-11 rounded-2xl border border-lime-300/22 bg-black/40 px-4 text-lime-50 outline-none transition focus:border-lime-300/45 focus:ring-2 focus:ring-lime-300/25"
                />
              </label>
            </div>

            <label className="mt-5 grid gap-2">
              <span className="text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/55">
                Subject
              </span>
              <input
                id={`${baseId}-subject`}
                name="subject"
                required
                className="h-11 rounded-2xl border border-lime-300/22 bg-black/40 px-4 text-lime-50 outline-none transition focus:border-lime-300/45 focus:ring-2 focus:ring-lime-300/25"
              />
            </label>

            <label className="mt-5 grid gap-2">
              <span className="text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/55">
                Message
              </span>
              <textarea
                id={`${baseId}-message`}
                name="message"
                required
                rows={6}
                className="resize-none rounded-2xl border border-lime-300/22 bg-black/40 px-4 py-3 text-lime-50 outline-none transition focus:border-lime-300/45 focus:ring-2 focus:ring-lime-300/25"
              />
            </label>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.22em] text-lime-100/45">
                {state === "sent" ? "Message queued (demo)." : "We reply thoughtfully."}
              </p>
              <Magnetic className="inline-block" strength={0.14}>
                <Button type="submit" variant="primary" size="roomy" disabled={state === "sent"}>
                  {state === "sent" ? "Sent" : "Send Message"}
                </Button>
              </Magnetic>
            </div>
          </form>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}


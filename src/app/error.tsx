"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/shared/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
  <div className="flex min-h-screen items-center justify-center bg-black px-6 text-lime-100">
    <div className="max-w-2xl text-center">
      <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45">
        Error State
      </p>

      <h1 className="mt-6 font-serif text-5xl tracking-[-0.03em] text-lime-50">
        The room glitched.
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lime-100/62">
        A temporary issue interrupted the experience. You can retry or return home.
      </p>

      <div className="mt-10 flex justify-center gap-3">
        <Button onClick={reset} variant="secondary" size="roomy">
          Retry
        </Button>

        <Button asChild variant="primary" size="roomy">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  </div>
);
}

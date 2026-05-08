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
    <html lang="en">
      <body className="bg-black text-lime-100">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45">Error State</p>
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
              <Link href="/">
                <Button variant="primary" size="roomy">Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}


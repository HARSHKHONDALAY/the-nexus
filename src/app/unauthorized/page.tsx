import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#030611] px-5 text-white">
      <section className="max-w-xl rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 text-center backdrop-blur-2xl">
        <ShieldAlert className="mx-auto text-amber-200" size={38} />
        <h1 className="mt-6 font-serif text-5xl tracking-[-0.04em]">Access denied</h1>
        <p className="mt-4 text-sm leading-7 text-white/58">Your account is authenticated, but it does not have permission to enter this admin surface.</p>
        <Link href="/admin/login" className="mt-7 inline-flex rounded-full bg-lime-300 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-black">Return to login</Link>
      </section>
    </main>
  );
}

import Link from "next/link";

export default function SessionExpiredPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#030611] px-5 text-white">
      <section className="max-w-xl rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 text-center backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45">Session expired</p>
        <h1 className="mt-5 font-serif text-5xl tracking-[-0.04em]">Please login again.</h1>
        <p className="mt-4 text-sm leading-7 text-white/58">Your secure session could not be refreshed, so protected admin access has been closed.</p>
        <Link href="/admin/login" className="mt-7 inline-flex rounded-full bg-lime-300 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-black">Login</Link>
      </section>
    </main>
  );
}

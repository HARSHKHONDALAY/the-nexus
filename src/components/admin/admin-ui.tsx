import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-6 pb-8 pt-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.42em] text-lime-100/45">{eyebrow}</p>
        <h2 className="mt-4 max-w-4xl font-serif text-[2.7rem] font-medium leading-[0.98] tracking-[-0.035em] text-lime-50 sm:text-5xl md:text-7xl">{title}</h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-lime-100/58 md:text-base">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode; variant?: "primary" | "ghost" }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" ? "bg-lime-300 text-black shadow-[0_0_35px_rgba(56,189,248,0.22)] hover:bg-lime-200" : "border border-lime-200/18 bg-lime-200/[0.04] text-lime-50 hover:bg-lime-200/[0.08]",
        props.className,
      )}
    >
      {children}
    </button>
  );
}

export function AdminCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("relative overflow-hidden rounded-[2rem] border border-lime-200/14 bg-lime-200/[0.045] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.22)] backdrop-blur-2xl", className)}>{children}</section>;
}

export function MetricCard({ label, value, detail, tone = "lime" }: { label: string; value: string; detail: string; tone?: "lime" | "blue" | "amber" | "rose" }) {
  const tones = {
    lime: "from-lime-300/22",
    blue: "from-cyan-300/18",
    amber: "from-amber-300/18",
    rose: "from-rose-300/18",
  };

  return (
    <AdminCard className="min-h-44">
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent", tones[tone])} />
      <div className="relative flex h-full flex-col justify-between gap-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.28em] text-lime-100/45">{label}</p>
          <ArrowUpRight size={16} className="text-lime-100/40" />
        </div>
        <div>
          <p className="font-serif text-4xl tracking-[-0.04em] text-lime-50 md:text-5xl">{value}</p>
          <p className="mt-3 text-sm leading-6 text-lime-100/56">{detail}</p>
        </div>
      </div>
    </AdminCard>
  );
}

export function StatusChip({ children, tone = "lime" }: { children: React.ReactNode; tone?: "lime" | "amber" | "red" | "neutral" | "blue" }) {
  const tones = {
    lime: "border-lime-300/22 bg-lime-300/12 text-lime-100",
    amber: "border-amber-300/22 bg-amber-300/12 text-amber-100",
    red: "border-rose-300/22 bg-rose-300/12 text-rose-100",
    neutral: "border-white/12 bg-white/[0.06] text-white/72",
    blue: "border-cyan-300/22 bg-cyan-300/12 text-cyan-100",
  };

  return <span className={cn("inline-flex rounded-full border px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em]", tones[tone])}>{children}</span>;
}

export function AdminToolbar({
  placeholder = "Search operations",
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-lime-200/12 bg-black/28 p-3 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <label className="flex flex-1 items-center gap-3 rounded-full border border-lime-200/12 bg-lime-200/[0.04] px-4 py-3 text-sm text-lime-100/48">
        <Search size={16} />
        <input type="search" value={value} onChange={(event) => onChange?.(event.target.value)} className="w-full bg-transparent text-lime-50 outline-none placeholder:text-lime-100/38" placeholder={placeholder} />
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded-full border border-lime-200/16 bg-lime-200/[0.05] px-4 py-3 text-xs uppercase tracking-[0.18em] text-lime-100/68">
        <SlidersHorizontal size={15} /> Filters
      </button>
    </div>
  );
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-lime-200/18 bg-black/24 p-8 text-center">
      <p className="font-serif text-3xl tracking-[-0.035em] text-lime-50">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-lime-100/54">{detail}</p>
    </div>
  );
}

export function PremiumTable({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-[1.75rem] border border-lime-200/12 bg-black/24">
      <div className="min-w-[760px]">
        <div className="grid border-b border-lime-200/10 bg-lime-200/[0.04] px-5 py-4 text-[0.65rem] uppercase tracking-[0.22em] text-lime-100/42" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(140px, 1fr))` }}>
          {columns.map((column) => <span key={column}>{column}</span>)}
        </div>
        {rows.length > 0 ? rows.map((row, index) => (
          <div key={index} className="grid items-center border-b border-lime-200/8 px-5 py-4 text-sm text-lime-50/86 transition hover:bg-lime-200/[0.035] last:border-b-0" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(140px, 1fr))` }}>
            {row.map((cell, cellIndex) => <div key={cellIndex} className="min-w-0 break-words pr-4">{cell}</div>)}
          </div>
        )) : (
          <div className="px-5 py-8 text-sm text-lime-100/54">No records available.</div>
        )}
      </div>
    </div>
  );
}

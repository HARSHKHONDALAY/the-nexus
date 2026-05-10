import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
        transition-all
        duration-500
         hover:border-white/20
         hover:bg-white/[0.05]
         shadow-[0_0_40px_rgba(255,255,255,0.04)]
         hover:shadow-[0_0_60px_rgba(255,255,255,0.08)]
         transform
         hover:-translate-y-1
         motion-safe:transition-transform
         motion-safe:duration-500
         motion-safe:ease-out
         focus-within:ring-2
         focus-within:ring-cyan-300/40
         focus-within:ring-offset-2
         focus-within:ring-offset-black
         ${className}
       `}
       tabIndex={0}
       role="group"
     >
       {children}
     </div>
  );
}
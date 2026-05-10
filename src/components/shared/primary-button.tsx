import { ArrowRight } from "lucide-react";

import { Button } from "@/components/shared/button";

interface PrimaryButtonProps {
  text: string;
}

export default function PrimaryButton({
  text,
}: PrimaryButtonProps) {
  return (
     <Button
       variant="primary"
       endIcon={<ArrowRight size={16} />}
       className="group relative inline-flex items-center justify-center gap-2 rounded-full border border-lime-300/50 bg-lime-300 px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.17em] text-black transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 active:scale-[0.98]"
     >
       <span className="transition-transform duration-300 group-hover:translate-x-1">
         {text}
       </span>
     </Button>
  );
}
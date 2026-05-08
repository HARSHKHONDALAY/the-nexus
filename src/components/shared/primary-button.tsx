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
    >
      {text}
    </Button>
  );
}
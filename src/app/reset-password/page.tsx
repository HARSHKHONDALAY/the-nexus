import Link from "next/link";
import { AuthScreen } from "@/components/auth/auth-screen";

export default function ResetPasswordPage() {
  return (
    <AuthScreen eyebrow="Session Repair" title="Reset links are disabled." description="This route will stay non-operational until secure reset tokens and email delivery are enabled in production.">
      <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-2xl bg-lime-300 px-5 text-sm font-bold text-black">
        Return to login
      </Link>
    </AuthScreen>
  );
}

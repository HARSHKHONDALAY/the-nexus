import Link from "next/link";
import { AuthScreen } from "@/components/auth/auth-screen";

export default function ForgotPasswordPage() {
  return (
    <AuthScreen eyebrow="Credential Recovery" title="Recovery is temporarily offline." description="Password reset is disabled until the production email workflow is connected.">
      <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-2xl bg-lime-300 px-5 text-sm font-bold text-black">
        Return to login
      </Link>
    </AuthScreen>
  );
}

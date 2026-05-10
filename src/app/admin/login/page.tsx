import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm admin />
    </Suspense>
  );
}

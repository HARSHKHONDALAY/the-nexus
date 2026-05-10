"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthButton, AuthInput, AuthScreen } from "@/components/auth/auth-screen";
import { useAuth } from "@/lib/auth/client";

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phoneNumber: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await auth.signup(form);
      router.push("/");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen eyebrow="Community Onboarding" title="Create your Nexus identity." description="Signup creates a standard USER account. Admin access remains unavailable unless a Super Admin assigns roles and permissions in the backend.">
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthInput placeholder="Full name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required />
        <AuthInput type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <AuthInput placeholder="Phone number" value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} />
        <AuthInput type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={8} />
        {error ? <p className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">{error}</p> : null}
        <AuthButton disabled={loading}>{loading ? "Creating" : "Signup"}</AuthButton>
      </form>
    </AuthScreen>
  );
}

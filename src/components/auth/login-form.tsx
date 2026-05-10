"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AuthButton, AuthInput, AuthScreen } from "./auth-screen";
import { useAuth } from "@/lib/auth/client";
import { hasRole } from "@/lib/auth/roles";

export function LoginForm({ admin = false }: { admin?: boolean }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const auth = useAuth();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await auth.login(identifier, password);

      if (
        admin &&
        !user.roles.some(
          (role) =>
            role === "ADMIN" ||
            role === "SUPER_ADMIN" ||
            role === "CHESS_NEXUS_ADMIN" ||
            role === "ART_NEXUS_ADMIN",
        )
      ) {
        await auth.logout();
        router.push("/unauthorized");
        return;
      }

      const nextPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;

      router.push(
        nextPath ??
          (hasRole(user, "SUPER_ADMIN")
            ? "/super-admin/dashboard"
            : admin
              ? "/admin/dashboard"
              : "/"),
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to login.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen
      eyebrow={admin ? "Restricted Admin Gateway" : "Member Access"}
      title={
        admin
          ? "Enter the operating room."
          : "Step back into The Nexus."
      }
      description={
        admin
          ? "Founder and operator access is verified with backend JWT sessions, refresh rotation, and role-scoped dashboard permissions."
          : "Your session stays synchronized with the platform backend while protected areas remain locked down."
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/42">
            {admin ? "Admin credential" : "Email or username"}
          </p>

          <AuthInput
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            autoComplete="username"
            placeholder={
              admin
                ? "operator@thenexus.in"
                : "you@example.com"
            }
            required
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/42">
            Password
          </p>

          <AuthInput
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>

        {error ? (
          <p className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">
            {error}
          </p>
        ) : null}

        <AuthButton disabled={loading}>
          {loading ? "Verifying" : "Login"}
        </AuthButton>

        <div className="flex items-center justify-between text-sm text-white/48">
          <span>Password recovery is handled by operations.</span>

          {!admin ? (
            <Link href="/signup" className="hover:text-white">
              Create account
            </Link>
          ) : null}
        </div>
      </form>
    </AuthScreen>
  );
}
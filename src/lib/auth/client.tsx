"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AuthUser } from "./types";
import { hasAnyPermission, hasAnyRole, hasPermission, hasRole } from "./roles";

type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (identifier: string, password: string) => Promise<AuthUser>;
  signup: (payload: { fullName: string; email: string; password: string; phoneNumber?: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthUser | null>;
  hasRole: typeof hasRole;
  hasAnyRole: typeof hasAnyRole;
  hasPermission: typeof hasPermission;
  hasAnyPermission: typeof hasAnyPermission;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function authRequest<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message ?? "Authentication request failed.");
  }
  return body.data as T;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const router = useRouter();
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    try {
      const nextUser = await authRequest<AuthUser>("/api/auth/refresh", { method: "POST" });
      setUser(nextUser);
      setStatus("authenticated");
      return nextUser;
    } catch {
      setUser(null);
      setStatus("anonymous");
      return null;
    }
  }, []);

  useEffect(() => {
    let alive = true;
    
    // Prevent race condition by checking current status before making requests
    if (status !== "loading") {
      return;
    }
    
    authRequest<AuthUser>("/api/auth/me")
      .then((nextUser) => {
        if (!alive) return;
        setUser(nextUser);
        setStatus("authenticated");
      })
      .catch((error) => {
        if (!alive) return;
        console.warn("Initial auth check failed, staying anonymous:", error);
        setUser(null);
        setStatus("anonymous");
      })
      .finally(() => {
        if (alive) setStatus((current) => (current === "loading" ? "anonymous" : current));
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (status === "authenticated" && user) {
      const interval = setInterval(async () => {
        try {
          const refreshedUser = await refresh();
          if (refreshedUser) {
            setUser(refreshedUser);
          }
        } catch (error) {
          console.warn("Token refresh failed:", error);
          // Don't automatically logout on refresh failure to prevent loops
        }
      }, 5 * 60 * 1000); // Refresh every 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [status, user, refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      async login(identifier, password) {
        const nextUser = await authRequest<AuthUser>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ identifier, password }),
        });
        setUser(nextUser);
        setStatus("authenticated");
        return nextUser;
      },
      async signup(payload) {
        const nextUser = await authRequest<AuthUser>("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setUser(nextUser);
        setStatus("authenticated");
        return nextUser;
      },
      async logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        setStatus("anonymous");
        router.push(pathname.startsWith("/admin") || pathname.startsWith("/super-admin") ? "/admin/login" : "/login");
      },
      refresh,
      hasRole,
      hasAnyRole,
      hasPermission,
      hasAnyPermission,
    }),
    [pathname, refresh, router, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}

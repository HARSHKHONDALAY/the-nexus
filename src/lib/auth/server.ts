import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { ACCESS_TOKEN_COOKIE } from "./cookies";
import { backendFetch } from "./backend";
import { hasAnyPermission, hasAnyRole, hasRole } from "./roles";
import type { AuthUser, NexusPermission, NexusRole } from "./types";

type GuardOptions = {
  roles?: NexusRole[];
  permissions?: NexusPermission[];
  superAdminOnly?: boolean;
};

export async function currentServerUser() {
  try {
    return await backendFetch<AuthUser>("/auth/me");
  } catch {
    return null;
  }
}

export async function requireServerUser(options: GuardOptions = {}) {
  const user = await currentServerUser();
  if (!user) {
    const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
    redirect(token ? "/session-expired" : "/admin/login");
  }

  if (options.superAdminOnly && !hasRole(user, "SUPER_ADMIN")) {
    redirect("/unauthorized");
  }

  if (options.roles?.length && !hasAnyRole(user, options.roles)) {
    redirect("/unauthorized");
  }

  if (options.permissions?.length && !hasAnyPermission(user, options.permissions)) {
    redirect("/unauthorized");
  }

  return user;
}

export async function currentPathname() {
  return (await headers()).get("x-current-path") ?? "";
}

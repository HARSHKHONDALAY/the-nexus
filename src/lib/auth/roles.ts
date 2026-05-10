import type { AuthUser, NexusPermission, NexusRole } from "./types";

export const adminRoutePermissions: Record<string, NexusPermission[]> = {
  "/admin/events": ["events.manage"],
  "/admin/attendees": ["registrations.read"],
  "/admin/analytics": ["analytics.read"],
  "/admin/finance": ["finance.read"],
  "/admin/moments": ["moments.manage"],
  "/admin/audit-logs": ["audit.read"],
  "/admin/settings": ["admin.manage", "permissions.manage"],
};

export function hasRole(user: AuthUser | null | undefined, role: NexusRole) {
  return Boolean(user?.roles?.includes(role));
}

export function hasAnyRole(user: AuthUser | null | undefined, roles: NexusRole[]) {
  return Boolean(user?.roles?.some((role) => roles.includes(role)));
}

export function hasPermission(user: AuthUser | null | undefined, permission: NexusPermission) {
  return hasRole(user, "SUPER_ADMIN") || Boolean(user?.permissions?.includes(permission));
}

export function hasAnyPermission(user: AuthUser | null | undefined, permissions: NexusPermission[]) {
  return hasRole(user, "SUPER_ADMIN") || permissions.some((permission) => user?.permissions?.includes(permission));
}

export type NexusRole = "SUPER_ADMIN" | "CHESS_NEXUS_ADMIN" | "ART_NEXUS_ADMIN" | "ADMIN" | "USER";

export type NexusPermission =
  | "admin.manage"
  | "permissions.manage"
  | "roles.read"
  | "users.read"
  | "users.manage"
  | "events.read"
  | "events.manage"
  | "registrations.read"
  | "registrations.manage"
  | "analytics.read"
  | "finance.read"
  | "finance.manage"
  | "moments.manage"
  | "audit.read"
  | string;

export type AuthUser = {
  id: string;
  email: string;
  username?: string | null;
  fullName: string;
  phoneNumber?: string | null;
  status: string;
  adminType?: "SUPER_ADMIN" | "CHESS_NEXUS_ADMIN" | "ART_NEXUS_ADMIN" | null;
  assignedEcosystemSlug?: string | null;
  roles: NexusRole[];
  permissions: NexusPermission[];
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  accessTokenExpiresAt: string;
  user: AuthUser;
};

export type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

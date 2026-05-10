"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminButton, AdminCard, AdminHeader, EmptyState, PremiumTable, StatusChip } from "@/components/admin/admin-ui";
import { adminProxyApi, formatAdminError } from "@/lib/admin/operations";
import type { AuthUser } from "@/lib/auth/types";

type AdminFormState = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  adminType: "CHESS_NEXUS_ADMIN" | "ART_NEXUS_ADMIN" | "SUPER_ADMIN";
  permissionCodes: string[];
};

const permissionOptions = [
  "events.read",
  "events.manage",
  "registrations.read",
  "registrations.manage",
  "finance.read",
  "finance.manage",
  "moments.manage",
  "audit.read",
];

const initialForm: AdminFormState = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
  adminType: "CHESS_NEXUS_ADMIN",
  permissionCodes: ["events.read", "registrations.read"],
};

async function adminManagementApi<T>(path: string, init?: RequestInit): Promise<T> {
  return adminProxyApi<T>(`admin/users${path}`, init);
}

export default function AdminSettingsClient() {
  const [admins, setAdmins] = useState<AuthUser[]>([]);
  const [form, setForm] = useState<AdminFormState>(initialForm);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ecosystemSlug = useMemo(() => {
    if (form.adminType === "CHESS_NEXUS_ADMIN") return "chess-nexus";
    if (form.adminType === "ART_NEXUS_ADMIN") return "art-nexus";
    return null;
  }, [form.adminType]);

  async function loadAdmins() {
    setLoading(true);
    try {
      setAdmins(await adminManagementApi<AuthUser[]>(""));
    } catch (error) {
      setMessage(formatAdminError(error, "Unable to load admins."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => void loadAdmins());
  }, []);

  async function createAdmin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await adminManagementApi<AuthUser>("", {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          temporaryPassword: form.password,
          phoneNumber: form.phoneNumber || null,
          adminType: form.adminType,
          ecosystemSlug,
          permissionCodes: form.permissionCodes,
        }),
      });
      setForm(initialForm);
      setMessage("Admin created.");
      await loadAdmins();
    } catch (error) {
      setMessage(formatAdminError(error, "Unable to create admin."));
    } finally {
      setSaving(false);
    }
  }

  async function patchAdmin(adminId: string, action: "disable" | "revoke-access" | "reset-password") {
    const temporaryPassword = action === "reset-password" ? window.prompt("Temporary password") : null;
    if (action === "reset-password" && !temporaryPassword) return;
    setMessage(null);
    try {
      await adminManagementApi<AuthUser>(`/${adminId}/${action}`, {
        method: "PATCH",
        body: action === "reset-password" ? JSON.stringify({ temporaryPassword }) : undefined,
      });
      setMessage(action === "reset-password" ? "Password reset and sessions revoked." : "Admin access updated.");
      await loadAdmins();
    } catch (error) {
      setMessage(formatAdminError(error, "Unable to update admin."));
    }
  }

  return (
    <>
      <AdminHeader
        eyebrow="Super Admin"
        title="Admin Access"
        description="Create scoped admins, revoke access, and reset credentials through backend-enforced controls."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminCard>
          <form onSubmit={createAdmin} className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Full name" value={form.fullName} onChange={(fullName) => setForm((current) => ({ ...current, fullName }))} />
              <Input label="Username" value={form.username} onChange={(username) => setForm((current) => ({ ...current, username }))} />
              <Input label="Email" type="email" value={form.email} onChange={(email) => setForm((current) => ({ ...current, email }))} />
              <Input label="Phone" value={form.phoneNumber} onChange={(phoneNumber) => setForm((current) => ({ ...current, phoneNumber }))} />
              <Input label="Temporary password" type="password" value={form.password} onChange={(password) => setForm((current) => ({ ...current, password }))} />
              <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-lime-100/48">
                Role
                <select
                  value={form.adminType}
                  onChange={(event) => setForm((current) => ({ ...current, adminType: event.target.value as AdminFormState["adminType"] }))}
                  className="rounded-2xl border border-lime-200/12 bg-black/35 px-4 py-3 text-sm normal-case tracking-normal text-lime-50 outline-none"
                >
                  <option value="CHESS_NEXUS_ADMIN">Chess Nexus Admin</option>
                  <option value="ART_NEXUS_ADMIN">Art Nexus Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3">
              <p className="text-xs uppercase tracking-[0.18em] text-lime-100/48">Permissions</p>
              <div className="grid gap-2 md:grid-cols-2">
                {permissionOptions.map((permission) => (
                  <label key={permission} className="flex items-center gap-3 rounded-2xl border border-lime-200/10 bg-black/24 px-4 py-3 text-sm text-lime-50/80">
                    <input
                      type="checkbox"
                      checked={form.permissionCodes.includes(permission)}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          permissionCodes: event.target.checked
                            ? [...current.permissionCodes, permission]
                            : current.permissionCodes.filter((code) => code !== permission),
                        }))
                      }
                    />
                    {permission}
                  </label>
                ))}
              </div>
            </div>

            {message ? <p className="text-sm text-lime-100/64">{message}</p> : null}
            <AdminButton type="submit" disabled={saving}>{saving ? "Creating" : "Create Admin"}</AdminButton>
          </form>
        </AdminCard>

        <AdminCard>
          {loading ? (
            <EmptyState title="Loading admins" detail="Fetching backend-authoritative access records." />
          ) : (
            <PremiumTable
              columns={["Admin", "Role", "Scope", "Status", "Actions"]}
              rows={admins.map((admin) => [
                <div key="admin">
                  <p>{admin.fullName}</p>
                  <p className="mt-1 text-xs text-lime-100/45">{admin.username ?? admin.email}</p>
                </div>,
                <StatusChip key="role" tone={admin.adminType === "SUPER_ADMIN" ? "blue" : "lime"}>{admin.adminType ?? "USER"}</StatusChip>,
                <span key="scope">{admin.assignedEcosystemSlug ?? "Global"}</span>,
                <StatusChip key="status" tone={admin.status === "ACTIVE" ? "lime" : "red"}>{admin.status}</StatusChip>,
                <div key="actions" className="flex flex-wrap gap-2">
                  <AdminButton variant="ghost" onClick={() => void patchAdmin(admin.id, "reset-password")}>Reset</AdminButton>
                  <AdminButton variant="ghost" onClick={() => void patchAdmin(admin.id, "disable")}>Disable</AdminButton>
                  <AdminButton variant="ghost" onClick={() => void patchAdmin(admin.id, "revoke-access")}>Revoke</AdminButton>
                </div>,
              ])}
            />
          )}
        </AdminCard>
      </div>
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-lime-100/48">
      {label}
      <input
        required={label !== "Phone"}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-lime-200/12 bg-black/35 px-4 py-3 text-sm normal-case tracking-normal text-lime-50 outline-none placeholder:text-lime-100/30"
      />
    </label>
  );
}

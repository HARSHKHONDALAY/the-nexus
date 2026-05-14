import { db } from "@/lib/db/client";

interface WriteAuditLogInput {
  entity_id?: string;
  entity_type?: string;
  action: string;
  metadata?: string;
}

export async function writeAuditLog(input: WriteAuditLogInput) {
  return db.platform_audit_logs.create({
    data: {
      entity_id: input.entity_id,
      entity_type: input.entity_type || "SYSTEM",
      action: input.action,
      ...(input.metadata === undefined || input.metadata === null ? {} : { metadata: input.metadata }),
    },
  });
}

export async function listAuditLogs(entityId?: string) {
  return db.platform_audit_logs.findMany({
    where: entityId ? { entity_id: entityId } : undefined,
    include: { users: true },
    orderBy: { created_at: "desc" },
    take: 100,
  });
}

import { db } from "@/lib/db/client";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface WriteAuditLogInput {
  eventId?: string;
  userId?: string;
  actionKey: string;
  actionLabel: string;
  details?: string;
  metadata?: JsonValue;
}

export async function writeAuditLog(input: WriteAuditLogInput) {
  return db.auditLog.create({
    data: {
      eventId: input.eventId,
      userId: input.userId,
      actionKey: input.actionKey,
      actionLabel: input.actionLabel,
      details: input.details,
      ...(input.metadata === undefined || input.metadata === null ? {} : { metadata: input.metadata }),
    },
  });
}

export async function listAuditLogs(eventId?: string) {
  return db.auditLog.findMany({
    where: eventId ? { eventId } : undefined,
    include: { event: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

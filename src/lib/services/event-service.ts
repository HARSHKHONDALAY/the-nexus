import { EventStatus } from "@prisma/client";
import { db } from "@/lib/db/client";
import { createEventSchema, type CreateEventInput } from "@/lib/validators/admin";
import { writeAuditLog } from "./audit-service";

export async function listEvents() {
  return db.event.findMany({
    where: { isDeleted: false },
    include: { _count: { select: { registrations: true } } },
    orderBy: { eventDate: "asc" },
  });
}

export async function createEvent(input: CreateEventInput) {
  const data = createEventSchema.parse(input);
  const event = await db.event.create({ data: { ...data, status: EventStatus.DRAFT } });
  await writeAuditLog({ eventId: event.id, actionKey: "event.created", actionLabel: "Event created", details: event.title });
  return event;
}

export async function duplicateEvent(eventId: string, nextEventKey: string, nextDate: Date) {
  const source = await db.event.findUniqueOrThrow({ where: { id: eventId } });
  const duplicated = await db.event.create({
    data: {
      eventKey: nextEventKey,
      title: source.title,
      eventDate: nextDate,
      dateLabel: source.dateLabel,
      timeLabel: source.timeLabel,
      venue: source.venue,
      locationShort: source.locationShort,
      price: source.price,
      venueCost: source.venueCost,
      maxSeats: source.maxSeats,
      upiId: source.upiId,
      whatsappLink: source.whatsappLink,
      qrImage: source.qrImage,
      logo: source.logo,
      status: EventStatus.DRAFT,
    },
  });
  await writeAuditLog({ eventId: duplicated.id, actionKey: "event.duplicated", actionLabel: "Event duplicated", details: `Duplicated from ${source.eventKey}` });
  return duplicated;
}

export async function setRegistrationClosed(eventId: string, registrationClosed: boolean) {
  const event = await db.event.update({ where: { id: eventId }, data: { registrationClosed } });
  await writeAuditLog({ eventId, actionKey: "event.registration_state", actionLabel: registrationClosed ? "Registration closed" : "Registration opened", details: event.title });
  return event;
}

export async function archiveEvent(eventId: string) {
  const event = await db.event.update({ where: { id: eventId }, data: { status: EventStatus.ARCHIVED, archivedToPast: true } });
  await writeAuditLog({ eventId, actionKey: "event.archived", actionLabel: "Event archived", details: event.title });
  return event;
}

export async function restoreArchivedEvent(eventId: string) {
  const event = await db.event.update({ where: { id: eventId }, data: { status: EventStatus.PAST, archivedToPast: false } });
  await writeAuditLog({ eventId, actionKey: "event.restored", actionLabel: "Event restored", details: event.title });
  return event;
}

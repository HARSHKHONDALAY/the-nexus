import { CheckInStatus, PaymentStatus, RegistrationStatus } from "@prisma/client";
import { db } from "@/lib/db/client";
import { createRegistrationSchema, type CreateRegistrationInput } from "@/lib/validators/admin";
import { writeAuditLog } from "./audit-service";

export async function listAttendees(eventId?: string) {
  return db.registration.findMany({
    where: eventId ? { eventId } : undefined,
    include: { event: true },
    orderBy: { submittedAt: "desc" },
  });
}

export async function createManualAttendee(input: CreateRegistrationInput) {
  const data = createRegistrationSchema.parse(input);
  const event = await db.event.findUniqueOrThrow({ where: { id: data.eventId } });
  const registration = await db.registration.create({
    data: {
      ...data,
      sourceType: "MANUAL",
      registrationStatus: RegistrationStatus.CONFIRMED,
      eventTitleSnapshot: event.title,
      eventDateSnapshot: event.eventDate,
      eventTimeSnapshot: event.timeLabel,
      eventVenueSnapshot: event.venue,
    },
  });
  await writeAuditLog({ eventId: event.id, actionKey: "attendee.manual_created", actionLabel: "Manual attendee created", details: registration.fullName });
  return registration;
}

export async function updatePaymentStatus(registrationId: string, paymentStatus: PaymentStatus) {
  const registration = await db.registration.update({ where: { id: registrationId }, data: { paymentStatus } });
  await writeAuditLog({ eventId: registration.eventId, actionKey: "attendee.payment_status", actionLabel: "Payment status updated", details: `${registration.fullName}: ${paymentStatus}` });
  return registration;
}

export async function checkInAttendee(registrationId: string) {
  const registration = await db.registration.update({
    where: { id: registrationId },
    data: { checkInStatus: CheckInStatus.CHECKED_IN, checkedInAt: new Date() },
  });
  await writeAuditLog({ eventId: registration.eventId, actionKey: "attendee.checked_in", actionLabel: "Attendee checked in", details: registration.fullName });
  return registration;
}

export async function bulkCheckInAttendees(registrationIds: string[]) {
  const result = await db.registration.updateMany({
    where: { id: { in: registrationIds }, checkInStatus: { not: CheckInStatus.CHECKED_IN } },
    data: { checkInStatus: CheckInStatus.CHECKED_IN, checkedInAt: new Date() },
  });
  await writeAuditLog({ actionKey: "attendee.bulk_check_in", actionLabel: "Bulk check-in", details: `${result.count} attendees checked in`, metadata: { registrationIds } });
  return { requested: registrationIds.length, updated: result.count, skipped: registrationIds.length - result.count };
}

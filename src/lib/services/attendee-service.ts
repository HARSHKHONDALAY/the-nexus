import { PaymentStatus } from "@/lib/types/prisma-enums";
import { db } from "@/lib/db/client";
import { createRegistrationSchema, type CreateRegistrationInput } from "@/lib/validators/admin";
import { writeAuditLog } from "./audit-service";

export async function listAttendees(eventId?: string) {
  return db.bookings.findMany({
    where: eventId ? { event_id: eventId } : undefined,
    include: { platform_events: true },
    orderBy: { created_at: "desc" },
  });
}

export async function createManualAttendee(input: CreateRegistrationInput) {
  const data = createRegistrationSchema.parse(input);
  const event = await db.platform_events.findUniqueOrThrow({ where: { id: data.eventId } });
  const registration = await db.bookings.create({
    data: {
      booking_reference: `ADMIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      event_id: data.eventId,
      ticket_tier_id: "admin-tier", // Default tier for admin-created bookings
      attendee_name: data.fullName,
      attendee_email: data.email || "",
      attendee_phone: data.contactNumber,
      quantity: 1,
      amount_paise: 0, // Admin bookings are free
      status: "CONFIRMED",
      source_type: "admin",
    },
  });
  await writeAuditLog({ entity_id: event.id, action: "attendee.manual_created", metadata: registration.attendee_name });
  return registration;
}

export async function updatePaymentStatus(bookingId: string, paymentStatus: PaymentStatus) {
  const booking = await db.bookings.update({ where: { id: bookingId }, data: { status: paymentStatus } });
  await writeAuditLog({ entity_id: booking.event_id, action: "attendee.payment_status", metadata: `${booking.attendee_name}: ${paymentStatus}` });
  return booking;
}

export async function checkInAttendee(bookingId: string) {
  const ticket = await db.tickets.updateMany({
    where: { booking_id: bookingId },
    data: { status: "USED", checked_in_at: new Date() },
  });
  const booking = await db.bookings.findUniqueOrThrow({ where: { id: bookingId } });
  await writeAuditLog({ entity_id: booking.event_id, action: "attendee.checked_in", metadata: booking.attendee_name });
  return { ticket, booking };
}

export async function bulkCheckInAttendees(bookingIds: string[]) {
  // First update tickets
  const ticketResult = await db.tickets.updateMany({
    where: { booking_id: { in: bookingIds }, status: { not: "USED" } },
    data: { status: "USED", checked_in_at: new Date() },
  });
  
  // Then get booking details for audit
  await db.bookings.findMany({ where: { id: { in: bookingIds } } });
  await writeAuditLog({ action: "attendee.bulk_check_in", metadata: `${ticketResult.count} attendees checked in: ${bookingIds.join(", ")}` });
  return { requested: bookingIds.length, updated: ticketResult.count, skipped: bookingIds.length - ticketResult.count };
}

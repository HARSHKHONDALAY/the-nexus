"use server";

import { revalidatePath } from "next/cache";
import { bulkCheckInAttendees, checkInAttendee, createManualAttendee } from "@/lib/services/attendee-service";
import { archiveEvent, createEvent, duplicateEvent, restoreArchivedEvent, setRegistrationClosed } from "@/lib/services/event-service";
import { createFinanceAdjustment } from "@/lib/services/finance-service";
import type { CreateEventInput, CreateRegistrationInput, FinanceAdjustmentInput } from "@/lib/validators/admin";

export async function createEventAction(input: CreateEventInput) {
  const event = await createEvent(input);
  revalidatePath("/admin/events");
  return event;
}

export async function duplicateEventAction(eventId: string, nextEventKey: string, nextDate: Date) {
  const event = await duplicateEvent(eventId, nextEventKey, nextDate);
  revalidatePath("/admin/events");
  return event;
}

export async function archiveEventAction(eventId: string) {
  const event = await archiveEvent(eventId);
  revalidatePath("/admin/events");
  return event;
}

export async function restoreArchivedEventAction(eventId: string) {
  const event = await restoreArchivedEvent(eventId);
  revalidatePath("/admin/events");
  return event;
}

export async function setRegistrationClosedAction(eventId: string, registrationClosed: boolean) {
  const event = await setRegistrationClosed(eventId, registrationClosed);
  revalidatePath("/admin/events");
  return event;
}

export async function createManualAttendeeAction(input: CreateRegistrationInput) {
  const attendee = await createManualAttendee(input);
  revalidatePath("/admin/attendees");
  return attendee;
}

export async function checkInAttendeeAction(registrationId: string) {
  const attendee = await checkInAttendee(registrationId);
  revalidatePath("/admin/attendees");
  return attendee;
}

export async function bulkCheckInAttendeesAction(registrationIds: string[]) {
  const result = await bulkCheckInAttendees(registrationIds);
  revalidatePath("/admin/attendees");
  return result;
}

export async function createFinanceAdjustmentAction(input: FinanceAdjustmentInput) {
  const adjustment = await createFinanceAdjustment(input);
  revalidatePath("/admin/finance");
  return adjustment;
}

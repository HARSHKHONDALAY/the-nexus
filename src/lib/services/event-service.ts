import { db } from "@/lib/db/client";

import {
  createEventSchema,
  type CreateEventInput,
} from "@/lib/validators/admin";

import { writeAuditLog } from "./audit-service";

interface EventInputData {
  title: string;
  description?: string;
  venue_name?: string;
  venue?: string;
  city?: string;
  starts_at?: string | Date;
  startsAt?: string | Date;
  ends_at?: string | Date;
  endsAt?: string | Date;
  capacity?: number;
  maxCapacity?: number;
}

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listEvents() {
  return db.platform_events.findMany({
    where: {
      deleted_at: null,
    },

    include: {
      event_categories: true,
    },

    orderBy: {
      created_at: "desc",
    },
  });
}

export async function createEvent(
  input: CreateEventInput,
) {
  const data =
    createEventSchema.parse(input);

  const slug =
    createSlug(data.title);

  const defaultCategory =
    await db.event_categories.findFirst();

  if (!defaultCategory) {
    throw new Error(
      "No event category found.",
    );
  }

  const event =
    await db.platform_events.create({
      data: {
        slug,

        title:
          data.title,

        description:
          (data as EventInputData).description ?? "",

        venue_name:
          (data as EventInputData).venue_name ??
          (data as EventInputData).venue ??
          "TBD Venue",

        city:
          (data as EventInputData).city ??
          "Mumbai",

        starts_at:
          (data as EventInputData).starts_at ??
          (data as EventInputData).startsAt ??
          new Date(),

        ends_at:
          (data as EventInputData).ends_at ??
          (data as EventInputData).endsAt ??
          new Date(),

        visibility:
          "PUBLIC",

        status:
          "DRAFT",

        capacity:
          (data as EventInputData).capacity ??
          (data as EventInputData).maxCapacity ??
          50,

        event_categories: {
          connect: {
            id: defaultCategory.id,
          },
        },
      },
    });

  await writeAuditLog({
    entity_id: event.id,
    entity_type: "EVENT",
    action: "event.created",
    metadata: `Event created: ${event.title}`,
  });

  return event;
}

export async function duplicateEvent(
  eventId: string,
  nextEventKey: string,
  nextDate: Date,
) {
  const source =
    await db.platform_events.findUniqueOrThrow({
      where: {
        id: eventId,
      },

      include: {
        event_categories: true,
      },
    });

  const slug =
    createSlug(nextEventKey);

  const duplicated =
    await db.platform_events.create({
      data: {
        slug,

        title:
          source.title,

        description:
          source.description,

        venue_name:
          source.venue_name,

        city:
          source.city,

        starts_at:
          nextDate,

        ends_at:
          nextDate,

        visibility:
          source.visibility,

        status:
          "DRAFT",

        capacity:
          source.capacity,

        event_categories: {
          connect: {
            id:
              source.event_categories.id,
          },
        },
      },
    });

  await writeAuditLog({
    entity_id: duplicated.id,
    entity_type: "EVENT",
    action: "event.duplicated",
    metadata: `Duplicated from ${source.slug}`,
  });

  return duplicated;
}

export async function setRegistrationClosed(
  eventId: string,
  registration_open: boolean,
) {
  const event =
    await db.platform_events.update({
      where: {
        id: eventId,
      },

      data: {
        registration_open:
          !registration_open,
      },
    });

  await writeAuditLog({
    entity_id: eventId,
    entity_type: "EVENT",
    action: "event.registration_state",
    metadata: registration_open ? "Registration closed" : "Registration opened",
  });

  return event;
}

export async function archiveEvent(
  eventId: string,
) {
  const event =
    await db.platform_events.update({
      where: {
        id: eventId,
      },

      data: {
        status:
          "ARCHIVED",
      },
    });

  await writeAuditLog({
    entity_id: eventId,
    entity_type: "EVENT",
    action: "event.archived",
    metadata: event.title,
  });

  return event;
}

export async function restoreArchivedEvent(
  eventId: string,
) {
  const event =
    await db.platform_events.update({
      where: {
        id: eventId,
      },

      data: {
        status:
          "PAST",
      },
    });

  await writeAuditLog({
    entity_id: eventId,
    entity_type: "EVENT",
    action: "event.restored",
    metadata: event.title,
  });

  return event;
}
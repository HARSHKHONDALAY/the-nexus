import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create only ONE chess event for production
  const events = [
    {
      category_id: "chess-category-id", // Will need to create this first
      slug: "chess-social-night-2026-06-15",
      title: "Chess Social Night",
      description: "A premium chess social experience for enthusiasts",
      starts_at: new Date("2026-06-15T19:00:00Z"),
      ends_at: new Date("2026-06-15T23:00:00Z"),
      venue_name: "The Chess Club",
      venue_address: "Bandra West, Mumbai",
      city: "Mumbai",
      capacity: 50,
      venue_cost_paise: 1500000,
      status: "PUBLISHED" as const,
      registration_open: true,
      allow_walk_ins: true,
      visibility: "PUBLIC" as const,
    },
  ];

  // First create event category
  const chessCategory = await prisma.event_categories.upsert({
    where: { slug: "chess-nexus" },
    update: {},
    create: {
      slug: "chess-nexus",
      name: "Chess Nexus",
      description: "Premium chess events and experiences",
      active: true,
    },
  });

  // Update the event with the actual category ID
  events[0].category_id = chessCategory.id;

  for (const event of events) {
    await prisma.platform_events.upsert({
      where: { slug: event.slug },
      update: event,
      create: event,
    });
  }

  const chessEvent = await prisma.platform_events.findUniqueOrThrow({ where: { slug: "chess-social-night-2026-06-15" } });

  await prisma.bookings.upsert({
    where: { booking_reference: "CHESS-2026-06-15-001" },
    update: {},
    create: {
      booking_reference: "CHESS-2026-06-15-001",
      event_id: chessEvent.id,
      ticket_tier_id: "default-tier-id", // Will need to create this first
      attendee_name: "Aarav Mehta",
      attendee_email: "aarav@nexus.local",
      attendee_phone: "9000000001",
      quantity: 1,
      amount_paise: 150000,
      status: "CONFIRMED",
    },
  });

  await prisma.finance_entries.create({
    data: {
      event_id: chessEvent.id,
      entry_type: "EXPENSE",
      amount_paise: 148700,
      note: "Ads",
    },
  });

  await prisma.platform_audit_logs.create({
    data: {
      entity_id: chessEvent.id,
      entity_type: "EVENT",
      action: "seed.admin_bootstrap",
      metadata: JSON.stringify({ source: "prisma/seed.ts" }),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

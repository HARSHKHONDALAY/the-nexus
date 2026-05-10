import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create only ONE chess event for production
  const events = [
    {
      eventKey: "chess-social-night-2026-06-15",
      title: "Chess Social Night",
      eventDate: new Date("2026-06-15"),
      dateLabel: "15/06/2026",
      timeLabel: "07:00PM TO 11:00PM",
      venue: "The Chess Club",
      locationShort: "Bandra",
      price: 1500,
      venueCost: 15000,
      maxSeats: 50,
      upiId: "Khushalnile06-1@okaxis",
      whatsappLink: "https://chat.whatsapp.com/FFFQ73MMhDk43xTr6muKFM?mode=hqctcli",
      status: "PUBLISHED" as const,
      registrationClosed: false,
      archivedToPast: false,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { eventKey: event.eventKey },
      update: event,
      create: event,
    });
  }

  const chessEvent = await prisma.event.findUniqueOrThrow({ where: { eventKey: "chess-social-night-2026-06-15" } });

  await prisma.registration.upsert({
    where: { eventId_contactNumber: { eventId: chessEvent.id, contactNumber: "9000000001" } },
    update: {},
    create: {
      eventId: chessEvent.id,
      fullName: "Aarav Mehta",
      contactNumber: "9000000001",
      email: "aarav@nexus.local",
      instagramId: "@aarav.moves",
      age: 27,
      locationArea: "Bandra",
      occupation: "Founder",
      workingSector: "Consumer Tech",
      whatsappOptIn: true,
      chessLevel: "INTERMEDIATE",
      dietaryPreference: "Vegetarian",
      paymentScreenshotUrl: "https://example.com/payment/aarav.png",
      agreementAccepted: true,
      checkInStatus: "NOT_CHECKED_IN",
      sourceType: "WEBSITE",
      paymentStatus: "VERIFIED",
      registrationStatus: "CONFIRMED",
      eventTitleSnapshot: chessEvent.title,
      eventDateSnapshot: chessEvent.eventDate,
      eventTimeSnapshot: chessEvent.timeLabel,
      eventVenueSnapshot: chessEvent.venue,
    },
  });

  await prisma.financeAdjustment.create({
    data: {
      eventId: chessEvent.id,
      section: "EXPENSE",
      operator: "ADD",
      amount: 1487,
      comment: "Ads",
    },
  });

  await prisma.auditLog.create({
    data: {
      eventId: chessEvent.id,
      actionKey: "seed.admin_bootstrap",
      actionLabel: "Admin seed bootstrap",
      details: "Seeded The Nexus admin operating database foundation.",
      metadata: { source: "prisma/seed.ts" },
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

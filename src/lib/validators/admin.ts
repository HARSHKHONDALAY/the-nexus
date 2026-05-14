import { z } from "zod";

export const createEventSchema = z.object({
  eventKey: z.string().min(3).max(120),
  title: z.string().min(2).max(255),
  starts_at: z.coerce.date(),
  dateLabel: z.string().min(1).max(50),
  timeLabel: z.string().min(1).max(100),
  venue: z.string().min(1).max(255),
  locationShort: z.string().min(1).max(120),
  price: z.coerce.number().nonnegative(),
  venueCost: z.coerce.number().nonnegative().default(0),
  maxSeats: z.coerce.number().int().positive(),
  upiId: z.string().max(150).default(""),
  whatsappLink: z.string().url().optional().or(z.literal("")),
  qrImage: z.string().optional(),
  logo: z.string().optional(),
});

export const createRegistrationSchema = z.object({
  eventId: z.string().min(1),
  fullName: z.string().min(2).max(255),
  contactNumber: z.string().min(7).max(30),
  email: z.string().email().optional().or(z.literal("")),
  instagramId: z.string().max(255).optional().default(""),
  age: z.coerce.number().int().nonnegative().optional(),
  locationArea: z.string().max(255).optional().default(""),
  occupation: z.string().max(255).optional().default(""),
  workingSector: z.string().max(255).optional().default(""),
  whatsappOptIn: z.coerce.boolean().default(false),
  chessLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "PROFESSIONAL", "SPECTATOR", "UNKNOWN"]).default("UNKNOWN"),
  dietaryPreference: z.string().max(100).optional().default(""),
  paymentScreenshotUrl: z.string().optional(),
  agreementAccepted: z.coerce.boolean().default(false),
  sourceType: z.enum(["WEBSITE", "MANUAL", "INSTAGRAM", "PARTNER", "BOOK_MY_SHOW", "WALK_IN", "IMPORTED"]).default("WEBSITE"),
  attendeeNote: z.string().optional(),
});

export const financeAdjustmentSchema = z.object({
  event_id: z.string().min(1),
  entry_type: z.enum(["REVENUE", "EXPENSE", "REFUND", "MISC"]),
  amount_paise: z.coerce.number().nonnegative(),
  note: z.string().optional(),
});

export const bulkAttendeeOperationSchema = z.object({
  registrationIds: z.array(z.string().min(1)).min(1),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
export type FinanceAdjustmentInput = z.infer<typeof financeAdjustmentSchema>;

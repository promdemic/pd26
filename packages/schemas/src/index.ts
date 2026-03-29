import { z } from "zod";

// "4:20 PM", "11:10 AM", etc.
export const timeStringSchema = z
  .string()
  .regex(/^\d{1,2}:\d{2} (AM|PM)$/, "Must be in h:mm AM/PM format");

export const TimelineEntrySchema = z.object({
  id: z.string(),
  time: timeStringSchema,
  label: z.string().min(1, "Label is required"),
});

export const EventInfoSchema = z.object({
  timeline: z.array(TimelineEntrySchema),
  updatedAt: z.unknown().optional(),
  updatedBy: z.string().optional(),
});

export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type EventInfo = z.infer<typeof EventInfoSchema>;

export const RsvpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dietary: z.string().optional(),
  songs: z.string().optional(),
  overnight: z.boolean(),
  updatedAt: z.unknown().optional(),
});

export type Rsvp = z.infer<typeof RsvpSchema>;

export const VolunteerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email(),
  updatedAt: z.unknown().optional(),
});

export type Volunteer = z.infer<typeof VolunteerSchema>;

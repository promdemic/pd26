import { z } from "zod";

export const TimelineEntrySchema = z.object({
  id: z.string(),
  time: z.string(),
  label: z.string(),
});

export const EventInfoSchema = z.object({
  timeline: z.array(TimelineEntrySchema),
  updatedAt: z.unknown().optional(),
  updatedBy: z.string().optional(),
});

export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type EventInfo = z.infer<typeof EventInfoSchema>;

import { z } from "zod";

export const EventGoalSchema = z.object({
  target: z.number(),
  reached: z.number(),
});

export const EventSchema = z.object({
  id: z.string(),
  hostId: z.string(),
  title: z.string(),
  birthDate: z.string(),
  theme: z.string(),
  message: z.string(),
  coverUrl: z.string(),
  listToken: z.string(),
  goal: EventGoalSchema.optional(),
});

export type EventGoal = z.infer<typeof EventGoalSchema>;
export type Event = z.infer<typeof EventSchema>;

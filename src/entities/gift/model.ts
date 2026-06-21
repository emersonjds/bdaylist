import { z } from "zod";

export const GroupGoalSchema = z.object({
  target: z.number(),
  collected: z.number(),
});

export const GiftSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  referencePrice: z.number(),
  storeLink: z.string(),
  mostWanted: z.boolean(),
  isGroup: z.boolean(),
  status: z.enum(["available", "reserved"]),
  groupGoal: GroupGoalSchema.optional(),
});

export type Gift = z.infer<typeof GiftSchema>;

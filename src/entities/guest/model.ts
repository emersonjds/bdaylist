import { z } from "zod";

export const GuestSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  email: z.string(),
});

export type Guest = z.infer<typeof GuestSchema>;

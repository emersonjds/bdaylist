import { z } from "zod";

export const RsvpSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  status: z.enum(["confirmed", "declined"]),
});

export type Rsvp = z.infer<typeof RsvpSchema>;

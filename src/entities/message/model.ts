import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  author: z.string(),
  text: z.string(),
  createdAt: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

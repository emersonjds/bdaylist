import { z } from "zod";

export const RsvpSchema = z.object({
  id: z.string(),
  eventoId: z.string(),
  nome: z.string(),
  status: z.enum(["confirmado", "recusado"]),
});

export type Rsvp = z.infer<typeof RsvpSchema>;

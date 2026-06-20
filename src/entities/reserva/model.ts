import { z } from "zod";

// idempotencyKey is persisted on the reservation record so the handler
// can detect duplicate submissions and replay safely (Task 8).
export const ReservaSchema = z.object({
  id: z.string(),
  presenteId: z.string(),
  convidadoNome: z.string(),
  recado: z.string(),
  idempotencyKey: z.string(),
  criadaEm: z.string(),
});

export type Reserva = z.infer<typeof ReservaSchema>;

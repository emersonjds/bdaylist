import { z } from "zod";

export const ConvidadoSchema = z.object({
  id: z.string(),
  eventoId: z.string(),
  nome: z.string(),
  email: z.string(),
});

export type Convidado = z.infer<typeof ConvidadoSchema>;

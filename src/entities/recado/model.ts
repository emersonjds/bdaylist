import { z } from "zod";

export const RecadoSchema = z.object({
  id: z.string(),
  eventoId: z.string(),
  autor: z.string(),
  texto: z.string(),
  criadoEm: z.string(),
});

export type Recado = z.infer<typeof RecadoSchema>;

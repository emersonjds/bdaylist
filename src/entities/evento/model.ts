import { z } from "zod";

export const MetaEventoSchema = z.object({
  alvo: z.number(),
  atingido: z.number(),
});

export const EventoSchema = z.object({
  id: z.string(),
  hostId: z.string(),
  titulo: z.string(),
  dataAniversario: z.string(),
  tema: z.string(),
  mensagem: z.string(),
  capaUrl: z.string(),
  listToken: z.string(),
  meta: MetaEventoSchema.optional(),
});

export type Evento = z.infer<typeof EventoSchema>;

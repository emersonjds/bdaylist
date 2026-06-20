import { z } from "zod";

export const EventoSchema = z.object({
  id: z.string(),
  hostId: z.string(),
  titulo: z.string(),
  dataAniversario: z.string(),
  tema: z.string(),
  mensagem: z.string(),
  capaUrl: z.string(),
  listToken: z.string(),
});

export type Evento = z.infer<typeof EventoSchema>;

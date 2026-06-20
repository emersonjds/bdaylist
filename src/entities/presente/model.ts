import { z } from "zod";

export const PresenteSchema = z.object({
  id: z.string(),
  eventoId: z.string(),
  nome: z.string(),
  descricao: z.string(),
  imagemUrl: z.string(),
  precoReferencia: z.number(),
  linkLoja: z.string(),
  maisDesejado: z.boolean(),
  emGrupo: z.boolean(),
  status: z.enum(["disponivel", "reservado"]),
});

export type Presente = z.infer<typeof PresenteSchema>;

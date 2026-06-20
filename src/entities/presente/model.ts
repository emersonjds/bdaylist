import { z } from "zod";

export const MetaGrupoSchema = z.object({
  alvo: z.number(),
  arrecadado: z.number(),
});

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
  metaGrupo: MetaGrupoSchema.optional(),
});

export type Presente = z.infer<typeof PresenteSchema>;

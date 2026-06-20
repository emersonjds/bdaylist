import { z } from "zod";

// Types are defined inline here (not imported from sibling entity slices)
// to respect the FSD rule that forbids lateral imports within the same layer.

const EventoEmListaSchema = z.object({
  id: z.string(),
  hostId: z.string(),
  titulo: z.string(),
  dataAniversario: z.string(),
  tema: z.string(),
  mensagem: z.string(),
  capaUrl: z.string(),
  listToken: z.string(),
});

const PresenteEmListaSchema = z.object({
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

export const ListaSchema = z.object({
  evento: EventoEmListaSchema,
  host: z.object({ id: z.string(), nome: z.string() }),
  presentes: z.array(PresenteEmListaSchema),
});

export type Lista = z.infer<typeof ListaSchema>;

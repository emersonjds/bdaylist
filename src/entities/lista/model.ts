import { z } from "zod";

// Types are defined inline here (not imported from sibling entity slices)
// to respect the FSD rule that forbids lateral imports within the same layer.

const EventInListaSchema = z.object({
  id: z.string(),
  hostId: z.string(),
  title: z.string(),
  birthDate: z.string(),
  theme: z.string(),
  message: z.string(),
  coverUrl: z.string(),
  listToken: z.string(),
});

const GiftInRegistrySchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  referencePrice: z.number(),
  storeLink: z.string(),
  mostWanted: z.boolean(),
  isGroup: z.boolean(),
  status: z.enum(["available", "reserved"]),
});

export const ListaSchema = z.object({
  evento: EventInListaSchema,
  host: z.object({ id: z.string(), nome: z.string() }),
  gifts: z.array(GiftInRegistrySchema),
});

export type Lista = z.infer<typeof ListaSchema>;

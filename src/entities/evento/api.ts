import { apiGet } from "@/shared/lib/http";
import type { Evento } from "./model";

// Inline shapes for the cross-entity fields to avoid lateral entity imports (FSD rule).
type GiftBasic = {
  id: string;
  eventId: string;
  name: string;
  description: string;
  imageUrl: string;
  referencePrice: number;
  storeLink: string;
  mostWanted: boolean;
  isGroup: boolean;
  status: "available" | "reserved";
};

type ConvidadoBasico = {
  id: string;
  eventoId: string;
  nome: string;
  email: string;
};

export type PainelResponse = {
  evento: Evento;
  gifts: GiftBasic[];
  convidados: ConvidadoBasico[];
  metrics: { confirmados: number };
};

export async function getPainel(authToken: string): Promise<PainelResponse> {
  return apiGet<PainelResponse>("/api/painel", {
    headers: { Authorization: `Bearer ${authToken}` },
  });
}

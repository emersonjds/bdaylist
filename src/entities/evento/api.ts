import { apiGet } from "@/shared/lib/http";
import type { Evento } from "./model";

// Inline shapes for the cross-entity fields to avoid lateral entity imports (FSD rule).
type PresenteBasico = {
  id: string;
  eventoId: string;
  nome: string;
  descricao: string;
  imagemUrl: string;
  precoReferencia: number;
  linkLoja: string;
  maisDesejado: boolean;
  emGrupo: boolean;
  status: "disponivel" | "reservado";
};

type ConvidadoBasico = {
  id: string;
  eventoId: string;
  nome: string;
  email: string;
};

export type PainelResponse = {
  evento: Evento;
  presentes: PresenteBasico[];
  convidados: ConvidadoBasico[];
  metrics: { confirmados: number };
};

export async function getPainel(authToken: string): Promise<PainelResponse> {
  return apiGet<PainelResponse>("/api/painel", {
    headers: { Authorization: `Bearer ${authToken}` },
  });
}

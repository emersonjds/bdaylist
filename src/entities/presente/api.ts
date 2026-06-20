import { apiSend } from "@/shared/lib/http";
import type { Presente } from "./model";

interface CriarPresenteBody {
  nome: string;
  descricao?: string;
  imagemUrl?: string;
  precoReferencia?: number;
  linkLoja?: string;
  maisDesejado?: boolean;
  emGrupo?: boolean;
}

interface AtualizarPresenteBody {
  nome?: string;
  descricao?: string;
  imagemUrl?: string;
  precoReferencia?: number;
  linkLoja?: string;
  maisDesejado?: boolean;
  emGrupo?: boolean;
}

export async function criarPresente(
  body: CriarPresenteBody,
): Promise<{ presente: Presente }> {
  return apiSend<{ presente: Presente }>("/api/presentes", {
    method: "POST",
    body,
  });
}

export async function atualizarPresente(
  id: string,
  body: AtualizarPresenteBody,
): Promise<{ presente: Presente }> {
  return apiSend<{ presente: Presente }>(`/api/presentes/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function removerPresente(id: string): Promise<{ success: boolean }> {
  return apiSend<{ success: boolean }>(`/api/presentes/${id}`, {
    method: "DELETE",
  });
}

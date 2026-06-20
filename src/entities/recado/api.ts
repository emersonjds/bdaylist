import { apiGet, apiSend } from "@/shared/lib/http";
import type { Recado } from "./model";

interface CriarRecadoBody {
  eventoId: string;
  autor: string;
  texto: string;
}

export async function getRecados(eventoId: string): Promise<{ recados: Recado[] }> {
  return apiGet<{ recados: Recado[] }>(`/api/recados/${eventoId}`);
}

export async function criarRecado(body: CriarRecadoBody): Promise<{ recado: Recado }> {
  return apiSend<{ recado: Recado }>("/api/recados", { method: "POST", body });
}

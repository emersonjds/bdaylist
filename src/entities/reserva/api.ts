import { apiSend } from "@/shared/lib/http";
import type { Reserva } from "./model";

interface CriarReservaBody {
  convidadoNome: string;
  recado: string;
  idempotencyKey: string;
}

export async function criarReserva(
  presenteId: string,
  body: CriarReservaBody,
): Promise<{ reserva: Reserva }> {
  return apiSend<{ reserva: Reserva }>(
    `/api/presentes/${presenteId}/reserva`,
    { method: "POST", body },
  );
}

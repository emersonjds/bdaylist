import { apiSend } from "@/shared/lib/http";
import type { Rsvp } from "./model";

interface EnviarRsvpBody {
  eventoId: string;
  nome: string;
  status?: "confirmado" | "recusado";
}

export async function enviarRsvp(body: EnviarRsvpBody): Promise<{ rsvp: Rsvp }> {
  return apiSend<{ rsvp: Rsvp }>("/api/rsvp", { method: "POST", body });
}

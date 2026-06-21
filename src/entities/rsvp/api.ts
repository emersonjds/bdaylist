import { apiSend } from "@/shared/lib/http";
import type { Rsvp } from "./model";

interface SubmitRsvpBody {
  eventId: string;
  name: string;
  status?: "confirmed" | "declined";
}

export async function submitRsvp(body: SubmitRsvpBody): Promise<{ rsvp: Rsvp }> {
  return apiSend<{ rsvp: Rsvp }>("/api/rsvp", { method: "POST", body });
}

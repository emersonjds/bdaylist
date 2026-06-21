import { apiSend } from "@/shared/lib/http";
import type { Guest } from "./model";

// Guests are listed via GET /api/dashboard (see entities/event/api.ts).
export interface CreateGuestInput {
  name: string;
  email: string;
}

export async function createGuest(input: CreateGuestInput): Promise<Guest> {
  const { guest } = await apiSend<{ guest: Guest }>("/api/guests", {
    method: "POST",
    body: input,
  });
  return guest;
}

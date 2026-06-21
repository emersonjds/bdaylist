import { apiGet } from "@/shared/lib/http";
import type { Event } from "./model";

// Inline shapes for cross-entity fields to avoid lateral entity imports (FSD rule).
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

type GuestBasic = {
  id: string;
  eventoId: string;
  nome: string;
  email: string;
};

export type DashboardResponse = {
  event: Event;
  gifts: GiftBasic[];
  convidados: GuestBasic[];
  metrics: { confirmed: number };
};

export async function getDashboard(authToken: string): Promise<DashboardResponse> {
  return apiGet<DashboardResponse>("/api/dashboard", {
    headers: { Authorization: `Bearer ${authToken}` },
  });
}

import { apiSend } from "@/shared/lib/http";
import type { Gift } from "./model";

interface CreateGiftBody {
  name: string;
  description?: string;
  imageUrl?: string;
  referencePrice?: number;
  storeLink?: string;
  mostWanted?: boolean;
  isGroup?: boolean;
}

interface UpdateGiftBody {
  name?: string;
  description?: string;
  imageUrl?: string;
  referencePrice?: number;
  storeLink?: string;
  mostWanted?: boolean;
  isGroup?: boolean;
}

export async function createGift(body: CreateGiftBody): Promise<{ gift: Gift }> {
  return apiSend<{ gift: Gift }>("/api/gifts", {
    method: "POST",
    body,
  });
}

export async function updateGift(
  id: string,
  body: UpdateGiftBody
): Promise<{ gift: Gift }> {
  return apiSend<{ gift: Gift }>(`/api/gifts/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteGift(id: string): Promise<{ success: boolean }> {
  return apiSend<{ success: boolean }>(`/api/gifts/${id}`, {
    method: "DELETE",
  });
}

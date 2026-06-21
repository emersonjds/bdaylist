import { apiSend } from "@/shared/lib/http";
import type { Reservation } from "./model";

interface ReserveGiftBody {
  guestName: string;
  message: string;
  idempotencyKey: string;
}

export async function reserveGift(
  giftId: string,
  body: ReserveGiftBody
): Promise<{ reservation: Reservation }> {
  return apiSend<{ reservation: Reservation }>(`/api/gifts/${giftId}/reservation`, {
    method: "POST",
    body,
  });
}

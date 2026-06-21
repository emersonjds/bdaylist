import { z } from "zod";

// idempotencyKey is persisted on the reservation record so the handler
// can detect duplicate submissions and replay safely.
export const ReservationSchema = z.object({
  id: z.string(),
  giftId: z.string(),
  guestName: z.string(),
  message: z.string(),
  idempotencyKey: z.string(),
  createdAt: z.string(),
});

export type Reservation = z.infer<typeof ReservationSchema>;

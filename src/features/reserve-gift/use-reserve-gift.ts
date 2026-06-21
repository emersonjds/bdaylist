"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reserveGift } from "@/entities/reservation/api";

interface ReserveGiftVars {
  guestName: string;
  message: string;
}

export function useReserveGift(giftId: string, token?: string) {
  const queryClient = useQueryClient();
  // One idempotency key per form mount — prevents double-submission
  const idempotencyKey = useRef(crypto.randomUUID());

  return useMutation({
    mutationFn: (vars: ReserveGiftVars) =>
      reserveGift(giftId, {
        guestName: vars.guestName,
        message: vars.message,
        idempotencyKey: idempotencyKey.current,
      }),
    onSuccess: () => {
      if (token) {
        void queryClient.invalidateQueries({ queryKey: ["registry", token] });
      }
    },
  });
}

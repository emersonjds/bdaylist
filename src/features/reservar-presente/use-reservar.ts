"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { criarReserva } from "@/entities/reserva/api";

interface ReservarVars {
  convidadoNome: string;
  recado: string;
}

export function useReservar(presenteId: string, token?: string) {
  const queryClient = useQueryClient();
  // One idempotency key per form mount — prevents double-submission
  const idempotencyKey = useRef(crypto.randomUUID());

  return useMutation({
    mutationFn: (vars: ReservarVars) =>
      criarReserva(presenteId, {
        convidadoNome: vars.convidadoNome,
        recado: vars.recado,
        idempotencyKey: idempotencyKey.current,
      }),
    onSuccess: () => {
      if (token) {
        void queryClient.invalidateQueries({ queryKey: ["registry", token] });
      }
    },
  });
}

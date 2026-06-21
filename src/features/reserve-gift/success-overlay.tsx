"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ConfettiBurst } from "@/shared/ui/confetti-burst";

interface SuccessOverlayProps {
  onBack: () => void;
}

export function SuccessOverlay({ onBack }: SuccessOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-primary-container/95 p-6"
      style={{ animation: "overlay-fade-in 0.5s ease-out" }}
    >
      <ConfettiBurst trigger={true} />

      <div
        className="relative z-10 w-full max-w-lg rounded-3xl p-10 text-center shadow-2xl"
        style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(8px)" }}
      >
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-xl">
          <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={2.5} />
        </div>

        <h1 className="mb-4 text-4xl font-extrabold text-on-primary-container">
          Presente Reservado!
        </h1>

        <p className="mb-8 text-lg text-on-primary-container/80">
          Sua reserva foi confirmada! O presente é combinado diretamente com o aniversariante.
        </p>

        <Button onClick={onBack} size="lg" className="w-full">
          Voltar à lista
        </Button>
      </div>
    </div>
  );
}

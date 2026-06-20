"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ConfettiBurst } from "@/shared/ui/confetti-burst";

interface SuccessOverlayProps {
  onVoltar: () => void;
}

export function SuccessOverlay({ onVoltar }: SuccessOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-primary-container/95 flex items-center justify-center p-6 overflow-hidden"
      style={{ animation: "overlay-fade-in 0.5s ease-out" }}
    >
      <ConfettiBurst trigger={true} />

      <div
        className="relative z-10 w-full max-w-lg text-center rounded-3xl p-10 shadow-2xl"
        style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(8px)" }}
      >
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>

        <h1 className="text-4xl font-extrabold text-on-primary-container mb-4">
          Presente Enviado!
        </h1>

        <p className="text-lg text-on-primary-container/80 mb-8">
          Você acabou de tornar o dia de alguém muito mais feliz!
        </p>

        <Button onClick={onVoltar} size="lg" className="w-full">
          Voltar à lista
        </Button>
      </div>
    </div>
  );
}

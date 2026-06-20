"use client";

import { MessageCircleHeart } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { useRecados } from "./use-recados";

interface RecadoListProps {
  eventoId: string;
}

function formatarDataCurta(isoString: string): string {
  const data = new Date(isoString);
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "agora mesmo";
  if (diffMin < 60) return `há ${diffMin} min`;

  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `há ${diffHoras}h`;

  return data.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

export function RecadoList({ eventoId }: RecadoListProps) {
  const { recados, isLoading } = useRecados(eventoId);

  if (isLoading) {
    return (
      <p className="text-on-surface-variant text-sm text-center py-4">
        Carregando recados...
      </p>
    );
  }

  if (recados.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-on-surface-variant">
        <MessageCircleHeart className="w-10 h-10 opacity-40" />
        <p className="text-sm">Seja o primeiro a deixar um recado!</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recados.map((recado) => (
        <li key={recado.id}>
          <Card className="p-5 flex flex-col gap-3">
            <p className="text-on-surface text-sm leading-relaxed">
              &ldquo;{recado.texto}&rdquo;
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-outline-variant/30">
              <span className="text-sm font-bold text-primary">
                {recado.autor}
              </span>
              <span className="text-xs text-on-surface-variant">
                {formatarDataCurta(recado.criadoEm)}
              </span>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

import { Gift, CheckCircle, Circle } from "lucide-react";
import { Card } from "@/shared/ui";

interface ResumoCardProps {
  total: number;
  reservados: number;
  disponiveis: number;
}

export function ResumoCard({ total, reservados, disponiveis }: ResumoCardProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-5 text-xl font-bold text-on-surface">Resumo da Lista</h2>
      <div className="grid grid-cols-3 divide-x divide-outline-variant/30">
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <Gift className="mb-1 h-6 w-6 text-primary" />
          <span className="text-3xl font-extrabold text-primary">{total}</span>
          <span className="text-[11px] font-semibold tracking-wide text-on-surface-variant uppercase">
            Presentes
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <CheckCircle className="mb-1 h-6 w-6 text-secondary" />
          <span className="text-3xl font-extrabold text-secondary">{reservados}</span>
          <span className="text-[11px] font-semibold tracking-wide text-on-surface-variant uppercase">
            Reservados
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <Circle className="mb-1 h-6 w-6 text-outline" />
          <span className="text-3xl font-extrabold text-on-surface">{disponiveis}</span>
          <span className="text-[11px] font-semibold tracking-wide text-on-surface-variant uppercase">
            Disponíveis
          </span>
        </div>
      </div>
    </Card>
  );
}

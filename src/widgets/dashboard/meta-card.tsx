import { Card, ProgressBar } from "@/shared/ui";
import { goalPercent, type EventGoal } from "@/entities/event";
import { formatPrice } from "@/entities/gift";

interface MetaCardProps {
  meta: EventGoal;
  total: number;
  reserved: number;
  available: number;
}

export function MetaCard({ meta, total, reserved, available }: MetaCardProps) {
  const pct = goalPercent(meta);
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-on-surface">Meta de Presentes</h2>
        <span className="text-sm font-bold text-primary">
          {formatPrice(meta.reached)} / {formatPrice(meta.target)}
        </span>
      </div>
      <ProgressBar value={pct} label="Progresso da meta de presentes" className="mb-4 h-4" />
      <p className="text-on-surface-variant">
        Você já atingiu {pct}% da meta total para a sua festa!
      </p>

      <div className="mt-auto grid grid-cols-3 divide-x divide-outline-variant/30 pt-6">
        <div className="px-2 text-center">
          <p className="text-2xl font-extrabold text-primary">{total}</p>
          <p className="text-[11px] font-semibold tracking-wide text-on-surface-variant uppercase">
            Presentes
          </p>
        </div>
        <div className="px-2 text-center">
          <p className="text-2xl font-extrabold text-secondary">{reserved}</p>
          <p className="text-[11px] font-semibold tracking-wide text-on-surface-variant uppercase">
            Reservados
          </p>
        </div>
        <div className="px-2 text-center">
          <p className="text-2xl font-extrabold text-on-surface">{available}</p>
          <p className="text-[11px] font-semibold tracking-wide text-on-surface-variant uppercase">
            Disponíveis
          </p>
        </div>
      </div>
    </Card>
  );
}

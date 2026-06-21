import { Card, ProgressBar } from "@/shared/ui";
import { goalPercent, type EventGoal } from "@/entities/event";
import { formatPrice } from "@/entities/gift";

interface MetaCardProps {
  meta: EventGoal;
}

export function MetaCard({ meta }: MetaCardProps) {
  const pct = goalPercent(meta);
  return (
    <Card className="p-6">
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
    </Card>
  );
}

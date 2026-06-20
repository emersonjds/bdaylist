import { CalendarCheck } from "lucide-react";
import { diasRestantes, rotuloContagem } from "./countdown";

interface CountdownBadgeProps {
  dataAniversario: string;
}

export function CountdownBadge({ dataAniversario }: CountdownBadgeProps) {
  const dias = diasRestantes(dataAniversario);
  const rotulo = rotuloContagem(dias);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-tertiary-fixed px-4 py-2 text-sm font-bold text-on-tertiary-fixed shadow-md">
      <CalendarCheck className="h-4 w-4 shrink-0" />
      <span>{rotulo}</span>
    </div>
  );
}

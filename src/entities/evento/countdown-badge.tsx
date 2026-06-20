import { CalendarCheck } from "lucide-react";
import { diasRestantes, rotuloContagem } from "./countdown";

interface CountdownBadgeProps {
  dataAniversario: string;
}

export function CountdownBadge({ dataAniversario }: CountdownBadgeProps) {
  const dias = diasRestantes(dataAniversario);
  const rotulo = rotuloContagem(dias);

  return (
    <div className="inline-flex items-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-full font-bold text-sm shadow-md">
      <CalendarCheck className="w-4 h-4 shrink-0" />
      <span>{rotulo}</span>
    </div>
  );
}

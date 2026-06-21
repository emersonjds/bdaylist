import { CalendarCheck } from "lucide-react";
import { daysRemaining, countdownLabel } from "./countdown";

interface CountdownBadgeProps {
  birthDate: string;
}

export function CountdownBadge({ birthDate }: CountdownBadgeProps) {
  const days = daysRemaining(birthDate);
  const label = countdownLabel(days);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-tertiary-fixed px-4 py-2 text-sm font-bold text-on-tertiary-fixed shadow-md">
      <CalendarCheck className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </div>
  );
}

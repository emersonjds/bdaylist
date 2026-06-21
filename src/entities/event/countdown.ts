export function daysRemaining(birthDate: string, now?: Date): number {
  const target = new Date(`${birthDate}T00:00:00`);
  const current = now ?? new Date();
  const today = new Date(current);
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function countdownLabel(days: number): string {
  if (days === 0) return "É hoje! 🎉";
  if (days === 1) return "Falta 1 dia";
  return `Faltam ${days} dias`;
}

export function diasRestantes(dataAniversario: string, agora?: Date): number {
  const target = new Date(`${dataAniversario}T00:00:00`);
  const now = agora ?? new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function rotuloContagem(dias: number): string {
  if (dias === 0) return "É hoje! 🎉";
  if (dias === 1) return "Falta 1 dia";
  return `Faltam ${dias} dias`;
}

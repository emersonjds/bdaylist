export interface MetaEvento {
  alvo: number;
  atingido: number;
}

export function percentualMeta(meta: MetaEvento): number {
  if (meta.alvo <= 0) return 0;
  return Math.min(100, Math.round((meta.atingido / meta.alvo) * 100));
}

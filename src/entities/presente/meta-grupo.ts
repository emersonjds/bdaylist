export interface MetaGrupo {
  alvo: number;
  arrecadado: number;
}

export function percentualGrupo(meta: MetaGrupo): number {
  if (meta.alvo <= 0) return 0;
  return Math.min(100, Math.round((meta.arrecadado / meta.alvo) * 100));
}

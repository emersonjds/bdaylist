import { Users } from "lucide-react";

interface ConvidadoBasico {
  id: string;
  nome: string;
  email: string;
}

interface ConvidadosRecentesProps {
  convidados: ConvidadoBasico[];
  confirmados: number;
}

const MAX_VISIBLE = 5;

export function ConvidadosRecentes({ convidados, confirmados }: ConvidadosRecentesProps) {
  if (confirmados === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <Users className="h-10 w-10 text-outline-variant" />
        <p className="text-sm text-on-surface-variant">Nenhum convidado confirmado ainda.</p>
      </div>
    );
  }

  const visiveis = convidados.slice(0, MAX_VISIBLE);
  const extras = Math.max(0, confirmados - MAX_VISIBLE);

  return (
    <div className="flex flex-wrap gap-3">
      {visiveis.map((convidado) => {
        const iniciais = convidado.nome
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        return (
          <div
            key={convidado.id}
            className="flex items-center gap-3 rounded-full border border-outline-variant/20 bg-surface-container-low px-4 py-2.5 shadow-sm transition-colors hover:bg-surface-container"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-primary">
              {iniciais}
            </div>
            <span className="text-sm font-semibold text-on-surface">{convidado.nome}</span>
          </div>
        );
      })}

      {extras > 0 && (
        <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-outline-variant text-xs font-bold text-on-surface shadow-sm transition-transform hover:scale-105">
          +{extras}
        </div>
      )}
    </div>
  );
}

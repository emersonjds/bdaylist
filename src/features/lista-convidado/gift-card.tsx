"use client";

import { useState } from "react";
import { Gift, Star, Users, PlusCircle } from "lucide-react";
import { Badge, Button, ProgressBar, ConfettiBurst } from "@/shared/ui";
import { formatPreco, percentualGrupo } from "@/entities/presente";
import type { Presente } from "@/entities/presente";

interface GiftCardProps {
  presente: Presente;
  onPresentear: () => void;
}

export function GiftCard({ presente, onPresentear }: GiftCardProps) {
  const reservado = presente.status === "reservado";
  const [showConfetti, setShowConfetti] = useState(false);
  const isGrupo = presente.emGrupo && presente.metaGrupo !== undefined;

  function handleClick() {
    setShowConfetti(true);
    onPresentear();
    setTimeout(() => setShowConfetti(false), 3500);
  }

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-[0px_10px_30px_rgba(255,90,112,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]">
      <ConfettiBurst trigger={showConfetti} />

      {/* Image */}
      <div className="relative h-56">
        {presente.imagemUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={presente.imagemUrl}
            alt={presente.nome}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container-low">
            <Gift className="h-16 w-16 text-outline-variant" />
          </div>
        )}

        {/* Badges overlaid on image */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {presente.maisDesejado && (
            <Badge tone="tertiary" className="flex items-center gap-1 shadow-md">
              <Star className="h-3 w-3 fill-current" />
              Mais Desejado
            </Badge>
          )}
          {presente.emGrupo && (
            <Badge tone="primary" className="flex items-center gap-1 shadow-md">
              <Users className="h-3 w-3" />
              Presente em Grupo
            </Badge>
          )}
          {reservado && (
            <Badge className="border border-outline-variant bg-surface-container text-on-surface-variant shadow-md">
              Reservado
            </Badge>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-grow flex-col justify-between p-6">
        <div>
          <h3 className="mb-1 text-lg font-bold text-on-surface">{presente.nome}</h3>
          <p className="mb-4 line-clamp-2 text-sm text-on-surface-variant">{presente.descricao}</p>

          {isGrupo && presente.metaGrupo && (
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-xs font-bold">
                <span className="text-secondary">
                  R$ {presente.metaGrupo.arrecadado.toLocaleString("pt-BR")} arrecadados
                </span>
                <span className="text-outline">
                  R$ {presente.metaGrupo.alvo.toLocaleString("pt-BR")}
                </span>
              </div>
              <ProgressBar
                value={percentualGrupo(presente.metaGrupo)}
                label={`${percentualGrupo(presente.metaGrupo)}% arrecadado`}
              />
            </div>
          )}
        </div>

        <div>
          {!isGrupo && (
            <div className="mb-4 text-xl font-bold text-primary">
              {formatPreco(presente.precoReferencia)}
            </div>
          )}

          {isGrupo ? (
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={reservado}
              onClick={handleClick}
            >
              <PlusCircle className="h-4 w-4" />
              Contribuir
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={reservado}
              onClick={handleClick}
            >
              <Gift className="h-4 w-4" />
              Presentear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

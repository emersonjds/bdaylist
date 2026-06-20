"use client";

import { Gift, Star, Users } from "lucide-react";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { formatPreco } from "@/entities/presente";
import type { Presente } from "@/entities/presente";

interface GiftCardProps {
  presente: Presente;
  onPresentear: () => void;
}

export function GiftCard({ presente, onPresentear }: GiftCardProps) {
  const reservado = presente.status === "reservado";

  return (
    <div className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02] shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
      {/* Image */}
      <div className="relative h-56">
        {presente.imagemUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={presente.imagemUrl}
            alt={presente.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
            <Gift className="w-16 h-16 text-outline-variant" />
          </div>
        )}

        {/* Badges overlaid on image */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {presente.maisDesejado && (
            <Badge tone="tertiary" className="flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3 fill-current" />
              Mais Desejado
            </Badge>
          )}
          {presente.emGrupo && (
            <Badge tone="primary" className="flex items-center gap-1 shadow-md">
              <Users className="w-3 h-3" />
              Presente em Grupo
            </Badge>
          )}
          {reservado && (
            <Badge className="bg-surface-container border border-outline-variant text-on-surface-variant shadow-md">
              Reservado
            </Badge>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-bold text-lg text-on-surface mb-1">
            {presente.nome}
          </h3>
          <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
            {presente.descricao}
          </p>
        </div>

        <div>
          <div className="text-primary font-bold text-xl mb-4">
            {formatPreco(presente.precoReferencia)}
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={reservado}
            onClick={onPresentear}
          >
            <Gift className="w-4 h-4" />
            Presentear
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Gift, Star, Users, PlusCircle } from "lucide-react";
import { Badge, Button, ProgressBar, ConfettiBurst } from "@/shared/ui";
import { formatPrice, groupGoalPercent } from "@/entities/gift";
import type { Gift as GiftType } from "@/entities/gift";

interface GiftCardProps {
  gift: GiftType;
  onPresentear: () => void;
}

export function GiftCard({ gift, onPresentear }: GiftCardProps) {
  const reserved = gift.status === "reserved";
  const [showConfetti, setShowConfetti] = useState(false);
  const isGroupGift = gift.isGroup && gift.groupGoal !== undefined;

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
        {gift.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gift.imageUrl}
            alt={gift.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container-low">
            <Gift className="h-16 w-16 text-outline-variant" />
          </div>
        )}

        {/* Badges overlaid on image */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {gift.mostWanted && (
            <Badge tone="tertiary" className="flex items-center gap-1 shadow-md">
              <Star className="h-3 w-3 fill-current" />
              Mais Desejado
            </Badge>
          )}
          {gift.isGroup && (
            <Badge tone="primary" className="flex items-center gap-1 shadow-md">
              <Users className="h-3 w-3" />
              Presente em Grupo
            </Badge>
          )}
          {reserved && (
            <Badge className="border border-outline-variant bg-surface-container text-on-surface-variant shadow-md">
              Reservado
            </Badge>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-grow flex-col justify-between p-6">
        <div>
          <h3 className="mb-1 text-lg font-bold text-on-surface">{gift.name}</h3>
          <p className="mb-4 line-clamp-2 text-sm text-on-surface-variant">{gift.description}</p>

          {isGroupGift && gift.groupGoal && (
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-xs font-bold">
                <span className="text-secondary">
                  R$ {gift.groupGoal.collected.toLocaleString("pt-BR")} arrecadados
                </span>
                <span className="text-outline">
                  R$ {gift.groupGoal.target.toLocaleString("pt-BR")}
                </span>
              </div>
              <ProgressBar
                value={groupGoalPercent(gift.groupGoal)}
                label={`${groupGoalPercent(gift.groupGoal)}% arrecadado`}
              />
            </div>
          )}
        </div>

        <div>
          {!isGroupGift && (
            <div className="mb-4 text-xl font-bold text-primary">
              {formatPrice(gift.referencePrice)}
            </div>
          )}

          {isGroupGift ? (
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={reserved}
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
              disabled={reserved}
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

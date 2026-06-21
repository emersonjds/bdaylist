"use client";

import { Pencil, Trash2, Link, Users } from "lucide-react";
import type { Gift } from "@/entities/gift";
import { formatPrice, groupGoalPercent } from "@/entities/gift";
import { Badge } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";

interface HostGiftCardProps {
  gift: Gift;
  onEdit: () => void;
  onDelete: () => void;
}

export function HostGiftCard({ gift, onEdit, onDelete }: HostGiftCardProps) {
  const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(gift.name)}&background=ff5a70&color=fff&size=200`;

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(255,90,112,0.15)]"
      )}
    >
      {/* Image */}
      <div className="relative h-40 w-full bg-surface-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gift.imageUrl || placeholderUrl}
          alt={gift.name}
          className="h-full w-full object-cover"
        />

        {gift.mostWanted && (
          <div className="absolute top-3 right-3">
            <Badge tone="tertiary">Mais Desejado</Badge>
          </div>
        )}

        {gift.isGroup && (
          <div className="absolute top-3 left-3">
            <Badge tone="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Em Grupo
            </Badge>
          </div>
        )}

        {gift.status === "reserved" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge tone="primary">Reservado</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 truncate text-base font-bold text-on-surface">{gift.name}</h3>
        <p className="mb-3 text-xl font-bold text-primary">
          {formatPrice(gift.referencePrice)}
        </p>

        <div className="flex items-center justify-between border-t border-outline-variant pt-3">
          {gift.isGroup && gift.groupGoal ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
              {groupGoalPercent(gift.groupGoal)}% Arrecadado
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
              <Link className="h-3.5 w-3.5" />
              {gift.storeLink ? "Link Externo" : "Sem link"}
            </span>
          )}

          <div className="flex gap-1">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Editar ${gift.name}`}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Remover ${gift.name}`}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

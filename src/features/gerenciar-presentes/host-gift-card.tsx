"use client";

import { Pencil, Trash2, Link, Users } from "lucide-react";
import type { Presente } from "@/entities/presente";
import { formatPreco } from "@/entities/presente";
import { Badge } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";

interface HostGiftCardProps {
  presente: Presente;
  onEdit: () => void;
  onDelete: () => void;
}

export function HostGiftCard({ presente, onEdit, onDelete }: HostGiftCardProps) {
  const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(presente.nome)}&background=ff5a70&color=fff&size=200`;

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(255,90,112,0.15)]"
      )}
    >
      {/* Imagem */}
      <div className="relative h-40 w-full bg-surface-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={presente.imagemUrl || placeholderUrl}
          alt={presente.nome}
          className="h-full w-full object-cover"
        />

        {presente.maisDesejado && (
          <div className="absolute top-3 right-3">
            <Badge tone="tertiary">Mais Desejado</Badge>
          </div>
        )}

        {presente.emGrupo && (
          <div className="absolute top-3 left-3">
            <Badge tone="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Em Grupo
            </Badge>
          </div>
        )}

        {presente.status === "reservado" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge tone="primary">Reservado</Badge>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="mb-1 truncate text-base font-bold text-on-surface">{presente.nome}</h3>
        <p className="mb-3 text-xl font-bold text-primary">
          {formatPreco(presente.precoReferencia)}
        </p>

        <div className="flex items-center justify-between border-t border-outline-variant pt-3">
          <span className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
            <Link className="h-3.5 w-3.5" />
            {presente.linkLoja ? "Link Externo" : "Sem link"}
          </span>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Editar ${presente.nome}`}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Remover ${presente.nome}`}
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

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Gift } from "@/entities/gift";
import { useGifts } from "./use-gifts";
import { GiftForm } from "./gift-form";
import type { GiftFormValues } from "./gift-form";
import { HostGiftCard } from "./host-gift-card";

export function GiftManager() {
  const { dashboard, isLoading, isError, create, update, remove } = useGifts();

  const [formOpen, setFormOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | undefined>(undefined);

  function openCreate() {
    setEditingGift(undefined);
    setFormOpen(true);
  }

  function openEdit(gift: Gift) {
    setEditingGift(gift);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingGift(undefined);
  }

  async function handleSubmit(data: GiftFormValues) {
    if (editingGift) {
      await update({ id: editingGift.id, ...data });
    } else {
      await create(data);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-container border-t-primary" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <p className="py-10 text-center text-on-surface-variant">
        Não foi possível carregar os presentes. Tente novamente.
      </p>
    );
  }

  const { gifts } = dashboard;

  return (
    <>
      <button
        type="button"
        onClick={openCreate}
        className="shadow-card mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-white active:scale-95 md:hidden"
      >
        <Plus className="h-4 w-4" />
        Adicionar Novo Presente
      </button>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {gifts.map((gift) => (
          <HostGiftCard
            key={gift.id}
            gift={gift}
            onEdit={() => openEdit(gift)}
            onDelete={() => remove(gift.id)}
          />
        ))}

        <button
          type="button"
          onClick={openCreate}
          className="group flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-outline-variant p-8 transition-all hover:bg-surface-container active:scale-95"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary transition-transform group-hover:scale-110">
            <Plus className="h-7 w-7" />
          </div>
          <span className="text-sm font-bold text-on-surface-variant">Adicionar Novo</span>
        </button>
      </div>

      <GiftForm open={formOpen} onClose={closeForm} gift={editingGift} onSubmit={handleSubmit} />
    </>
  );
}

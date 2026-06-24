"use client";

import { useState } from "react";
import { Users, CheckCircle2, Mail, UserPlus } from "lucide-react";
import { useGifts } from "@/features/manage-gifts/use-gifts";
import { useAddGuest } from "@/features/manage-guests/use-add-guest";
import { GuestForm } from "@/features/manage-guests/guest-form";
import type { GuestFormValues } from "@/features/manage-guests/guest-form";
import { Card, Badge } from "@/shared/ui";

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function GuestsPage() {
  const { dashboard, isLoading, isError } = useGifts();
  const { addGuest } = useAddGuest();
  const [formOpen, setFormOpen] = useState(false);

  async function handleSubmit(data: GuestFormValues) {
    await addGuest(data);
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
        Não foi possível carregar os convidados. Tente novamente.
      </p>
    );
  }

  const { guests, metrics } = dashboard;

  return (
    <>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">
            Convidados
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Adicione convidados e acompanhe quem confirmou presença.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-sm font-bold text-on-secondary-container">
            <CheckCircle2 className="h-4 w-4" />
            {metrics.confirmed} confirmados
          </div>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="shadow-card inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            Adicionar Convidado
          </button>
        </div>
      </header>

      {guests.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Users className="h-12 w-12 text-primary-container" />
          <p className="text-sm text-on-surface-variant">
            Nenhum convidado ainda. Adicione o primeiro!
          </p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-4">
          {guests.map((guest) => (
            <li key={guest.id}>
              <Card className="-colors flex items-center gap-4 px-5 py-5 hover:bg-surface-container-low sm:px-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary-container">
                  {initials(guest.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-on-surface">{guest.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-on-surface-variant">
                    <Mail className="h-3 w-3 shrink-0" />
                    {guest.email}
                  </p>
                </div>
                {guest.confirmed ? (
                  <Badge tone="secondary">Confirmado</Badge>
                ) : (
                  <Badge tone="neutral">Pendente</Badge>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}

      <GuestForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} />
    </>
  );
}

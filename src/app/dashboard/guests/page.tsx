"use client";

import { Users, CheckCircle2, Mail } from "lucide-react";
import { useGifts } from "@/features/manage-gifts/use-gifts";
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
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">
            Convidados
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Quem confirmou presença na sua festa.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-sm font-bold text-on-secondary-container">
          <CheckCircle2 className="h-4 w-4" />
          {metrics.confirmed} confirmados
        </div>
      </header>

      {guests.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Users className="h-12 w-12 text-outline-variant" />
          <p className="text-sm text-on-surface-variant">
            Nenhum convidado confirmou presença ainda.
          </p>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guests.map((guest) => (
            <li key={guest.id}>
              <Card className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-primary">
                  {initials(guest.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-on-surface">{guest.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-on-surface-variant">
                    <Mail className="h-3 w-3 shrink-0" />
                    {guest.email}
                  </p>
                </div>
                <Badge tone="secondary">Confirmado</Badge>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

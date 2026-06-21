"use client";

import Link from "next/link";
import { Calendar, Users, Share2, Gift } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useGifts } from "@/features/manage-gifts/use-gifts";
import { SummaryCard } from "@/widgets/dashboard/summary-card";
import { MetaCard } from "@/widgets/dashboard/meta-card";
import { RecentGuests } from "@/widgets/dashboard/recent-guests";
import { daysRemaining, countdownLabel } from "@/entities/event";
import { Card } from "@/shared/ui";

export default function DashboardPage() {
  const { user } = useAuth();
  const { dashboard, isLoading, isError } = useGifts();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-container border-t-primary" />
          <p className="text-sm text-on-surface-variant">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-on-surface-variant">
          Não foi possível carregar o painel. Tente novamente.
        </p>
      </div>
    );
  }

  const { event, gifts, guests, metrics } = dashboard;
  const days = daysRemaining(event.birthDate);
  const label = countdownLabel(days);
  const reservedCount = gifts.filter((gift) => gift.status === "reserved").length;
  const availableCount = gifts.length - reservedCount;

  return (
    <>
      <section className="animate-in fade-in slide-in-from-bottom-4 mb-8 duration-700">
        <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">
          Olá, {user?.name ?? "Aniversariante"}!{" "}
          <span className="inline-block animate-bounce">🎈</span>
        </h1>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-sm font-bold text-on-primary-container">
          <Calendar className="h-4 w-4" />
          {label} para sua festa
        </div>
      </section>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-full md:col-span-2">
          {event.goal ? (
            <MetaCard
              meta={event.goal}
              total={gifts.length}
              reserved={reservedCount}
              available={availableCount}
            />
          ) : (
            <SummaryCard total={gifts.length} reserved={reservedCount} available={availableCount} />
          )}
        </div>

        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container">
            <Users className="h-7 w-7 text-on-secondary-container" />
          </div>
          <p className="text-4xl font-extrabold text-primary">{metrics.confirmed}</p>
          <p className="mt-1 text-xs font-bold tracking-wider text-on-surface-variant uppercase">
            Convidados Confirmados
          </p>

          <div className="my-4 h-px w-12 bg-outline-variant/40" />

          <p className="text-3xl font-extrabold text-secondary">{guests.length}</p>
          <p className="mt-1 text-xs font-bold tracking-wider text-on-surface-variant uppercase">
            Convidados no Total
          </p>

          <Link
            href="/dashboard/guests"
            className="mt-4 text-sm font-bold text-secondary transition-all hover:underline"
          >
            Ver lista completa
          </Link>
        </Card>
      </div>

      <section className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/dashboard/gifts"
          className="group flex items-center gap-4 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0px_10px_30px_rgba(255,90,112,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(255,90,112,0.15)]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary transition-transform group-hover:scale-110">
            <Gift className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Meus Presentes</h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              {gifts.length} {gifts.length === 1 ? "item na lista" : "itens na lista"} · gerenciar
            </p>
          </div>
        </Link>

        <Card className="flex flex-col justify-center gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-bold text-on-surface">Compartilhe sua lista</h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              Envie o link para seus convidados
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const url = `${window.location.origin}/l/${event.listToken}`;
              void navigator.clipboard.writeText(url);
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-primary px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/5 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            Copiar Link
          </button>
        </Card>
      </section>

      <section className="mb-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-on-surface">Confirmados Recentemente</h2>
          {metrics.confirmed > 0 && (
            <Link
              href="/dashboard/guests"
              className="text-sm font-bold text-secondary transition-all hover:underline"
            >
              Ver Todos ({metrics.confirmed})
            </Link>
          )}
        </div>

        <RecentGuests guests={guests.filter((guest) => guest.confirmed)} confirmed={metrics.confirmed} />
      </section>
    </>
  );
}

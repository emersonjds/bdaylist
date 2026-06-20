"use client";

import { useState } from "react";
import { Calendar, Plus, Users, Share2 } from "lucide-react";
import { RequireAuth, useAuth } from "@/features/auth";
import { usePresentes } from "@/features/gerenciar-presentes/use-presentes";
import { GiftForm } from "@/features/gerenciar-presentes/gift-form";
import type { GiftFormValues } from "@/features/gerenciar-presentes/gift-form";
import { HostGiftCard } from "@/features/gerenciar-presentes/host-gift-card";
import { AppShell } from "@/widgets/app-shell/app-shell";
import { ResumoCard } from "@/widgets/painel/resumo-card";
import { ConvidadosRecentes } from "@/widgets/painel/convidados-recentes";
import { diasRestantes, rotuloContagem } from "@/entities/evento";
import type { Presente } from "@/entities/presente";
import { Card } from "@/shared/ui";

export default function PainelPage() {
  return (
    <RequireAuth>
      <AppShell>
        <PainelContent />
      </AppShell>
    </RequireAuth>
  );
}

function PainelContent() {
  const { user } = useAuth();
  const { painel, isLoading, isError, criar, atualizar, remover } =
    usePresentes();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPresente, setEditingPresente] = useState<Presente | undefined>(
    undefined,
  );

  function abrirCriar() {
    setEditingPresente(undefined);
    setFormOpen(true);
  }

  function abrirEditar(presente: Presente) {
    setEditingPresente(presente);
    setFormOpen(true);
  }

  function fecharForm() {
    setFormOpen(false);
    setEditingPresente(undefined);
  }

  async function handleSubmit(data: GiftFormValues) {
    if (editingPresente) {
      await atualizar({ id: editingPresente.id, ...data });
    } else {
      await criar(data);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-container border-t-primary" />
          <p className="text-sm text-on-surface-variant">
            Carregando seu painel...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !painel) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-on-surface-variant">
          Não foi possível carregar o painel. Tente novamente.
        </p>
      </div>
    );
  }

  const { evento, presentes, convidados, metrics } = painel;
  const dias = diasRestantes(evento.dataAniversario);
  const rotulo = rotuloContagem(dias);
  const reservados = presentes.filter((p) => p.status === "reservado").length;
  const disponiveis = presentes.length - reservados;

  return (
    <>
      {/* Saudação */}
      <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">
          Olá, {user?.nome ?? "Aniversariante"}!{" "}
          <span className="inline-block animate-bounce">🎈</span>
        </h1>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-sm font-bold text-on-surface">
          <Calendar className="h-4 w-4" />
          {rotulo} para sua festa
        </div>
      </section>

      {/* Métricas */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ResumoCard
            total={presentes.length}
            reservados={reservados}
            disponiveis={disponiveis}
          />
        </div>

        {/* Convidados Confirmados */}
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container">
            <Users className="h-7 w-7 text-on-secondary-container" />
          </div>
          <p className="text-4xl font-extrabold text-primary">
            {metrics.confirmados}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Convidados Confirmados
          </p>
          <button
            type="button"
            className="mt-4 text-sm font-bold text-secondary transition-all hover:underline"
          >
            Ver lista completa
          </button>
        </Card>
      </div>

      {/* Gerenciar Presentes */}
      <section className="mb-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-on-surface">
              Meus Presentes
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Gerencie os itens da sua lista de desejos
            </p>
          </div>
          <button
            type="button"
            onClick={abrirCriar}
            className="hidden items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-card transition-all hover:scale-105 active:scale-95 md:flex"
          >
            <Plus className="h-4 w-4" />
            Adicionar Presente
          </button>
        </div>

        {/* Botão mobile */}
        <button
          type="button"
          onClick={abrirCriar}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-white shadow-card active:scale-95 md:hidden"
        >
          <Plus className="h-4 w-4" />
          Adicionar Novo Presente
        </button>

        {/* Grid de presentes */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {presentes.map((presente) => (
            <HostGiftCard
              key={presente.id}
              presente={presente}
              onEdit={() => abrirEditar(presente)}
              onDelete={() => remover(presente.id)}
            />
          ))}

          {/* Tile dashed — Adicionar Novo */}
          <button
            type="button"
            onClick={abrirCriar}
            className="group flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-outline-variant p-8 transition-all hover:bg-surface-container active:scale-95"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary transition-transform group-hover:scale-110">
              <Plus className="h-7 w-7" />
            </div>
            <span className="text-sm font-bold text-on-surface-variant">
              Adicionar Novo
            </span>
          </button>
        </div>
      </section>

      {/* Compartilhar lista */}
      <section className="mb-10">
        <Card className="flex flex-col items-center gap-4 p-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="text-lg font-bold text-on-surface">
              Compartilhe sua lista
            </h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              Envie o link para seus convidados escolherem um presente
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const url = `${window.location.origin}/l/${evento.listToken}`;
              void navigator.clipboard.writeText(url);
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-primary px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/5 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            Copiar Link
          </button>
        </Card>
      </section>

      {/* Convidados Recentes */}
      <section className="mb-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-on-surface">
            Confirmados Recentemente
          </h2>
          {metrics.confirmados > 0 && (
            <button
              type="button"
              className="text-sm font-bold text-secondary transition-all hover:underline"
            >
              Ver Todos ({metrics.confirmados})
            </button>
          )}
        </div>

        <ConvidadosRecentes
          convidados={convidados}
          confirmados={metrics.confirmados}
        />
      </section>

      {/* Formulário (Dialog) */}
      <GiftForm
        open={formOpen}
        onClose={fecharForm}
        presente={editingPresente}
        onSubmit={handleSubmit}
      />
    </>
  );
}

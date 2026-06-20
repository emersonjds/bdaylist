"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, CalendarCheck, Gift, MessageCircleHeart } from "lucide-react";
import { HostHeader } from "@/widgets/host-header/host-header";
import { GiftGrid } from "@/widgets/gift-grid/gift-grid";
import { RsvpModal } from "@/features/rsvp/rsvp-modal";
import { RecadoForm } from "@/features/recados/recado-form";
import { RecadoList } from "@/features/recados/recado-list";
import { GiftCard } from "./gift-card";
import { PriceFilter } from "./price-filter";
import { SearchBox } from "./search-box";
import { useLista } from "./use-lista";

interface ListaConvidadoScreenProps {
  token: string;
}

export function ListaConvidadoScreen({ token }: ListaConvidadoScreenProps) {
  const router = useRouter();
  const [rsvpOpen, setRsvpOpen] = useState(false);

  const {
    lista,
    isLoading,
    isError,
    search,
    setSearch,
    priceFaixa,
    setPriceFaixa,
    presentesFiltrados,
  } = useLista(token);

  function handlePresentear(presenteId: string) {
    router.push(`/l/${token}/presentear/${presenteId}`);
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Fixed top navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant/50 shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
        <div className="flex items-center gap-2">
          <PartyPopper className="w-5 h-5 text-primary" />
          <span className="text-xl font-extrabold text-primary tracking-tight">
            BdayList
          </span>
        </div>

        {/* Desktop RSVP button */}
        <button
          type="button"
          onClick={() => setRsvpOpen(true)}
          className="hidden md:flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          <CalendarCheck className="w-4 h-4" />
          Confirmar Presença (RSVP)
        </button>
      </header>

      <main className="pt-24 pb-32 max-w-[1200px] mx-auto px-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Gift className="w-12 h-12 text-primary-container animate-pulse" />
            <p className="text-on-surface-variant text-lg">
              Carregando presentes...
            </p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-on-surface-variant text-lg">
              Não foi possível carregar a lista. Tente novamente.
            </p>
          </div>
        )}

        {lista && (
          <>
            <HostHeader
              titulo={lista.evento.titulo}
              mensagem={lista.evento.mensagem}
              dataAniversario={lista.evento.dataAniversario}
              capaUrl={lista.evento.capaUrl}
              hostNome={lista.host.nome}
              onRsvp={() => setRsvpOpen(true)}
            />

            <section className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant">
              <PriceFilter value={priceFaixa} onChange={setPriceFaixa} />
              <SearchBox value={search} onChange={setSearch} />
            </section>

            {presentesFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Gift className="w-12 h-12 text-outline-variant" />
                <p className="text-on-surface-variant text-lg">
                  Nenhum presente encontrado com esses filtros.
                </p>
              </div>
            ) : (
              <GiftGrid>
                {presentesFiltrados.map((presente) => (
                  <GiftCard
                    key={presente.id}
                    presente={presente}
                    onPresentear={() => handlePresentear(presente.id)}
                  />
                ))}
              </GiftGrid>
            )}

            {/* Mural de Recados */}
            <section className="mt-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container/20">
                  <MessageCircleHeart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
                    Mural de Recados
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    Deixe uma mensagem carinhosa para o aniversariante
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card p-6">
                  <h3 className="text-base font-bold text-on-surface mb-4">
                    Deixe seu recado
                  </h3>
                  <RecadoForm eventoId={lista.evento.id} />
                </div>

                <div className="lg:col-span-2">
                  <RecadoList eventoId={lista.evento.id} />
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {lista && (
        <RsvpModal
          open={rsvpOpen}
          onClose={() => setRsvpOpen(false)}
          eventoId={lista.evento.id}
        />
      )}

      {/* Footer */}
      <footer className="w-full flex flex-col items-center gap-4 px-6 pb-8 pt-12 bg-surface-container border-t border-outline-variant/30">
        <div className="flex items-center gap-2">
          <PartyPopper className="w-5 h-5 text-primary" />
          <span className="text-xl font-bold text-primary">BdayList</span>
        </div>
        <div className="flex gap-6 text-on-surface-variant text-xs font-semibold">
          <a href="#" className="hover:text-primary transition-colors">
            Termos de Uso
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Privacidade
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contato
          </a>
        </div>
        <p className="text-on-surface-variant text-xs opacity-70">
          © 2024 BdayList — Transformando desejos em festas.
        </p>
      </footer>
    </div>
  );
}

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
    filteredGifts,
  } = useLista(token);

  function handlePresentear(giftId: string) {
    router.push(`/l/${token}/presentear/${giftId}`);
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Floating background balloons */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
        style={{ zIndex: -1 }}
      >
        <div
          className="absolute bottom-[-100px] left-[10%] h-20 w-16 rounded-full bg-confetti-pink opacity-60"
          style={{ animation: "float-up 15s linear 0s infinite" }}
        />
        <div
          className="absolute bottom-[-100px] left-[30%] h-16 w-12 rounded-full bg-confetti-blue opacity-60"
          style={{ animation: "float-up 15s linear 4s infinite" }}
        />
        <div
          className="absolute bottom-[-100px] left-[60%] h-[72px] w-14 rounded-full bg-confetti-yellow opacity-60"
          style={{ animation: "float-up 15s linear 2s infinite" }}
        />
        <div
          className="absolute bottom-[-100px] left-[85%] h-24 w-20 rounded-full bg-confetti-pink opacity-60"
          style={{ animation: "float-up 15s linear 8s infinite" }}
        />
      </div>

      {/* Fixed top navigation */}
      <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant/50 bg-surface px-6 shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
        <div className="flex items-center gap-2">
          <PartyPopper className="h-5 w-5 text-primary" />
          <span className="text-xl font-extrabold tracking-tight text-primary">BdayList</span>
        </div>

        {/* Desktop RSVP button */}
        <button
          type="button"
          onClick={() => setRsvpOpen(true)}
          className="hidden items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-bold text-on-primary shadow-lg transition-all hover:scale-105 active:scale-95 md:flex"
        >
          <CalendarCheck className="h-4 w-4" />
          Confirmar Presença (RSVP)
        </button>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 pt-24 pb-32">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Gift className="h-12 w-12 animate-pulse text-primary-container" />
            <p className="text-lg text-on-surface-variant">Carregando presentes...</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-lg text-on-surface-variant">
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

            <section className="mb-10 flex flex-col items-start justify-between gap-6 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:flex-row md:items-center">
              <PriceFilter value={priceFaixa} onChange={setPriceFaixa} />
              <SearchBox value={search} onChange={setSearch} />
            </section>

            {filteredGifts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <Gift className="h-12 w-12 text-outline-variant" />
                <p className="text-lg text-on-surface-variant">
                  Nenhum presente encontrado com esses filtros.
                </p>
              </div>
            ) : (
              <GiftGrid>
                {filteredGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className={gift.mostWanted ? "lg:col-span-2" : undefined}
                  >
                    <GiftCard
                      gift={gift}
                      onPresentear={() => handlePresentear(gift.id)}
                    />
                  </div>
                ))}
              </GiftGrid>
            )}

            {/* Mural de Recados */}
            <section className="mt-16">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container/20">
                  <MessageCircleHeart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">
                    Mural de Recados
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    Deixe uma mensagem carinhosa para o aniversariante
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="shadow-card rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 lg:col-span-1">
                  <h3 className="mb-4 text-base font-bold text-on-surface">Deixe seu recado</h3>
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
        <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} eventoId={lista.evento.id} />
      )}

      {/* Footer */}
      <footer className="flex w-full flex-col items-center gap-4 border-t border-outline-variant/30 bg-surface-container px-6 pt-12 pb-8">
        <div className="flex items-center gap-2">
          <PartyPopper className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold text-primary">BdayList</span>
        </div>
        <div className="flex gap-6 text-xs font-semibold text-on-surface-variant">
          <a href="#" className="transition-colors hover:text-primary">
            Termos de Uso
          </a>
          <a href="#" className="transition-colors hover:text-primary">
            Privacidade
          </a>
          <a href="#" className="transition-colors hover:text-primary">
            Contato
          </a>
        </div>
        <p className="text-xs text-on-surface-variant opacity-70">
          © 2024 BdayList — Transformando desejos em festas.
        </p>
      </footer>
    </div>
  );
}

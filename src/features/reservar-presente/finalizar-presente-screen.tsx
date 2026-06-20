"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Gift, PartyPopper } from "lucide-react";
import { getLista } from "@/entities/lista/api";
import { formatPreco } from "@/entities/presente/format-preco";
import { Badge } from "@/shared/ui/badge";
import { ReservaForm } from "./reserva-form";
import { SuccessOverlay } from "./success-overlay";

interface FinalizarPresenteScreenProps {
  token: string;
  giftId: string;
}

export function FinalizarPresenteScreen({
  token,
  giftId,
}: FinalizarPresenteScreenProps) {
  const router = useRouter();
  const [succeeded, setSucceeded] = useState(false);

  const { data: lista, isLoading, isError } = useQuery({
    queryKey: ["lista", token],
    queryFn: () => getLista(token),
  });

  const presente = lista?.presentes.find((p) => p.id === giftId);

  function handleVoltar() {
    router.push(`/l/${token}`);
  }

  if (succeeded) {
    return <SuccessOverlay onVoltar={handleVoltar} />;
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      <header className="fixed top-0 left-0 w-full z-50 flex items-center gap-4 px-6 h-16 bg-surface border-b border-outline-variant/50 shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
        <button
          type="button"
          onClick={handleVoltar}
          className="hover:scale-105 transition-transform text-primary"
          aria-label="Voltar à lista"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-xl font-extrabold text-primary tracking-tight">
          BdayList
        </span>
      </header>

      <main className="pt-24 pb-32 max-w-[1200px] mx-auto px-6">
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Gift className="w-12 h-12 text-primary-container animate-pulse" />
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-24">
            <p className="text-on-surface-variant text-lg">
              Não foi possível carregar o presente. Tente novamente.
            </p>
          </div>
        )}

        {lista && !presente && (
          <div className="flex items-center justify-center py-24">
            <p className="text-on-surface-variant text-lg">
              Presente não encontrado.
            </p>
          </div>
        )}

        {presente && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Gift Summary */}
            <section className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
                <h2 className="text-xl font-bold text-primary mb-6">
                  Resumo do Presente
                </h2>

                <div className="flex gap-4 mb-6 p-4 bg-surface-container-low rounded-lg">
                  {presente.imagemUrl ? (
                    <img
                      src={presente.imagemUrl}
                      alt={presente.nome}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                      <Gift className="w-10 h-10 text-outline-variant" />
                    </div>
                  )}

                  <div className="flex flex-col justify-center gap-1">
                    <h3 className="font-bold text-on-surface">{presente.nome}</h3>
                    <p className="text-primary font-bold text-lg">
                      {formatPreco(presente.precoReferencia)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                      <Gift className="w-3.5 h-3.5" />
                      {presente.emGrupo ? "Presente em Grupo" : "Presente Inteiro"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {presente.maisDesejado && (
                    <Badge tone="tertiary">Mais Desejado</Badge>
                  )}
                  {presente.emGrupo && (
                    <Badge tone="primary">Presente em Grupo</Badge>
                  )}
                </div>
              </div>
            </section>

            {/* Right: Reservation Form */}
            <section className="lg:col-span-7">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_10px_30px_rgba(255,90,112,0.08)] p-6">
                <h2 className="text-xl font-bold text-on-surface mb-6">
                  Dados para Reserva
                </h2>
                <ReservaForm
                  gift={presente}
                  token={token}
                  onSuccess={() => setSucceeded(true)}
                />
              </div>
            </section>
          </div>
        )}
      </main>

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
      </footer>
    </div>
  );
}

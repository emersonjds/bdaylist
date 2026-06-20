"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CreditCard, Gift, PartyPopper, QrCode, ShieldCheck } from "lucide-react";
import { getLista } from "@/entities/lista/api";
import { formatPreco } from "@/entities/presente/format-preco";
import { Badge } from "@/shared/ui/badge";
import { ReservaForm } from "./reserva-form";
import { SuccessOverlay } from "./success-overlay";

interface FinalizarPresenteScreenProps {
  token: string;
  giftId: string;
}

export function FinalizarPresenteScreen({ token, giftId }: FinalizarPresenteScreenProps) {
  const router = useRouter();
  const [succeeded, setSucceeded] = useState(false);

  const {
    data: lista,
    isLoading,
    isError,
  } = useQuery({
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
      <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center gap-4 border-b border-outline-variant/50 bg-surface px-6 shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
        <button
          type="button"
          onClick={handleVoltar}
          className="text-primary transition-transform hover:scale-105"
          aria-label="Voltar à lista"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <span className="text-xl font-extrabold tracking-tight text-primary">BdayList</span>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 pt-24 pb-32">
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Gift className="h-12 w-12 animate-pulse text-primary-container" />
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-24">
            <p className="text-lg text-on-surface-variant">
              Não foi possível carregar o presente. Tente novamente.
            </p>
          </div>
        )}

        {lista && !presente && (
          <div className="flex items-center justify-center py-24">
            <p className="text-lg text-on-surface-variant">Presente não encontrado.</p>
          </div>
        )}

        {presente && (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left: Gift Summary */}
            <section className="space-y-6 lg:col-span-5">
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
                <h2 className="mb-6 text-xl font-bold text-primary">Resumo do Presente</h2>

                <div className="mb-6 flex gap-4 rounded-lg bg-surface-container-low p-4">
                  {presente.imagemUrl ? (
                    <img
                      src={presente.imagemUrl}
                      alt={presente.nome}
                      className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container">
                      <Gift className="h-10 w-10 text-outline-variant" />
                    </div>
                  )}

                  <div className="flex flex-col justify-center gap-1">
                    <h3 className="font-bold text-on-surface">{presente.nome}</h3>
                    <p className="text-lg font-bold text-primary">
                      {formatPreco(presente.precoReferencia)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                      <Gift className="h-3.5 w-3.5" />
                      {presente.emGrupo ? "Presente em Grupo" : "Presente Inteiro"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {presente.maisDesejado && <Badge tone="tertiary">Mais Desejado</Badge>}
                  {presente.emGrupo && <Badge tone="primary">Presente em Grupo</Badge>}
                </div>
              </div>

              {/* Security badge */}
              <div className="flex items-center gap-4 rounded-xl border border-secondary/20 bg-secondary-container/20 p-4">
                <ShieldCheck className="h-8 w-8 shrink-0 text-secondary" />
                <div>
                  <p className="text-sm font-bold text-secondary">Transação 100% Segura</p>
                  <p className="text-xs text-on-secondary-container">
                    Seus dados estão protegidos por criptografia de ponta a ponta.
                  </p>
                </div>
              </div>
            </section>

            {/* Right: Reservation Form + Decorative Payment Block */}
            <section className="space-y-6 lg:col-span-7">
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
                <h2 className="mb-6 text-xl font-bold text-on-surface">Dados para Reserva</h2>
                <ReservaForm gift={presente} token={token} onSuccess={() => setSucceeded(true)} />
              </div>

              {/* Decorative payment block — purely visual, all inputs disabled */}
              <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
                <div className="border-b border-outline-variant/30 p-6">
                  <h2 className="text-xl font-bold text-on-surface">Escolha como pagar</h2>
                  {/* Pagamento desabilitado — o presente é combinado fora do app */}
                  <p className="mt-1 text-xs text-on-surface-variant">
                    Pagamento indisponível — o presente é combinado fora do app.
                  </p>
                </div>

                <div className="space-y-4 p-6">
                  {/* PIX option (disabled) */}
                  <div className="flex items-center rounded-xl border-2 border-outline-variant/50 p-4 opacity-50">
                    <div className="flex w-full items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                        <QrCode className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">PIX</p>
                        <p className="text-xs text-on-surface-variant">Aprovação instantânea</p>
                      </div>
                    </div>
                  </div>

                  {/* Credit card option (disabled) */}
                  <div className="flex items-center rounded-xl border-2 border-outline-variant/50 p-4 opacity-50">
                    <div className="flex w-full items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                        <CreditCard className="h-6 w-6 text-on-surface-variant" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Cartão de Crédito</p>
                        <p className="text-xs text-on-surface-variant">Até 12x no cartão</p>
                      </div>
                    </div>
                  </div>

                  {/* Disabled card fields — purely decorative, hidden from assistive tech */}
                  <div
                    aria-hidden="true"
                    className="space-y-4 border-t border-dashed border-outline-variant pt-4 opacity-50"
                  >
                    <div>
                      <p className="mb-1 text-xs font-bold text-on-surface-variant">
                        Nome no Cartão
                      </p>
                      <input
                        disabled
                        tabIndex={-1}
                        placeholder="Como escrito no cartão"
                        className="w-full rounded-lg border border-outline-variant p-3 text-sm"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold text-on-surface-variant">
                        Número do Cartão
                      </p>
                      <input
                        disabled
                        tabIndex={-1}
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-lg border border-outline-variant p-3 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="mb-1 text-xs font-bold text-on-surface-variant">Validade</p>
                        <input
                          disabled
                          tabIndex={-1}
                          placeholder="MM/AA"
                          className="w-full rounded-lg border border-outline-variant p-3 text-sm"
                        />
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-bold text-on-surface-variant">CVV</p>
                        <input
                          disabled
                          tabIndex={-1}
                          placeholder="123"
                          className="w-full rounded-lg border border-outline-variant p-3 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtotal / Total */}
                <div className="flex flex-col gap-2 bg-surface-container-low p-6">
                  <div className="flex justify-between px-2">
                    <span className="text-sm text-on-surface">Subtotal:</span>
                    <span className="text-sm font-bold text-on-surface">
                      {formatPreco(presente.precoReferencia)}
                    </span>
                  </div>
                  <div className="flex justify-between px-2 text-primary">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-lg font-bold">
                      {formatPreco(presente.precoReferencia)}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

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
      </footer>
    </div>
  );
}

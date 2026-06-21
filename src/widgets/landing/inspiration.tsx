"use client";

import { ArrowRight, PartyPopper, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";

export function Inspiration() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  async function handleCreateRegistry() {
    if (!user) {
      await signInWithGoogle();
    }
    router.push("/dashboard");
  }

  return (
    <section className="px-6 py-20 md:py-[80px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <h2 className="mb-4 text-3xl font-bold text-on-surface">Inspire-se com listas reais</h2>
            <p className="text-base text-on-surface-variant">
              Veja como outros aniversariantes estão organizando suas festas dos sonhos ao redor do
              Brasil.
            </p>
          </div>
          <button className="group flex items-center gap-2 text-sm font-bold text-primary">
            Ver todas as listas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Card 1 — featured large (col-span-8) */}
          <div className="group relative h-[400px] overflow-hidden rounded-[32px] md:col-span-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-secondary" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <PartyPopper className="h-64 w-64 text-white" />
            </div>
            <div className="absolute bottom-0 left-0 z-20 w-full p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                  DESTAQUE
                </span>
                <span className="flex items-center gap-1 text-sm text-white/80">São Paulo, SP</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">
                30 Anos da Julia: Viagem para o Atacama
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-3">
                  {["bg-gray-200", "bg-gray-300", "bg-gray-400"].map((bg, i) => (
                    <div key={i} className={`h-10 w-10 rounded-full border-2 border-white ${bg}`} />
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-white">
                    +45
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Users className="h-4 w-4" />
                  <span>48 convidados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — "Comece agora" CTA (col-span-4) replaces AI card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-primary-container p-8 md:col-span-4">
            <div className="z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <PartyPopper className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">Comece agora</h3>
              <p className="text-base text-white/80">
                Crie sua lista em minutos e compartilhe com quem você ama. É simples, gratuito e sem
                complicação.
              </p>
            </div>
            <button
              className="z-10 mt-6 w-full rounded-2xl bg-white py-4 text-sm font-bold text-primary transition-colors hover:bg-surface-container"
              onClick={handleCreateRegistry}
            >
              Criar minha lista
            </button>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <PartyPopper className="h-[120px] w-[120px] text-white" />
            </div>
          </div>

          {/* Card 3 — kids party photo (col-span-4) */}
          <div className="group relative h-[300px] overflow-hidden rounded-[32px] md:col-span-4">
            <div className="absolute inset-0 bg-gradient-to-br from-confetti-yellow via-confetti-pink to-primary-container transition-colors group-hover:opacity-80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 text-6xl">🎈</div>
              <h4 className="text-2xl font-bold text-white">Festas Infantis</h4>
              <p className="mt-2 text-sm text-white/90">
                Praticidade para os pais e alegria para os pequenos.
              </p>
            </div>
          </div>

          {/* Card 4 — security (col-span-8) */}
          <div className="flex h-[300px] overflow-hidden rounded-[32px] bg-white shadow-lg md:col-span-8">
            <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
              <h4 className="mb-4 text-2xl font-bold text-on-surface">Segurança total para você</h4>
              <ul className="space-y-3">
                {[
                  "Reservas protegidas sem duplicação",
                  "Link exclusivo para cada lista",
                  "Suporte para você e seus convidados",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-on-surface-variant"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-fixed-dim text-secondary">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-secondary-fixed to-secondary-container md:flex">
              <div className="text-center">
                <div className="mb-4 text-7xl">🔒</div>
                <p className="text-sm font-bold text-secondary">100% seguro</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

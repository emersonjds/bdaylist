"use client";

import { Search, Gift, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";

export function Hero() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  async function handleCriarLista() {
    if (!user) {
      await signInWithGoogle();
    }
    router.push("/dashboard");
  }

  return (
    <header className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-48 md:pb-40">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-[-10%] h-96 w-96 animate-pulse rounded-full bg-primary-container opacity-10 blur-3xl" />
      <div className="absolute bottom-10 left-[-5%] h-64 w-64 rounded-full bg-secondary-container opacity-20 blur-3xl" />

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-2">
        {/* Copy */}
        <div className="z-10">
          <span className="mb-6 inline-block rounded-full bg-primary-fixed px-4 py-1 text-sm font-bold text-on-primary-fixed-variant">
            A FESTA COMEÇA AQUI 🎉
          </span>
          <h1 className="mb-6 text-4xl leading-tight font-extrabold text-on-surface md:text-5xl">
            Sua lista de presentes de aniversário de um{" "}
            <span className="text-primary italic">jeito fácil</span>
          </h1>
          <p className="mb-10 max-w-lg text-lg text-on-surface-variant">
            Transforme seus desejos em comemorações inesquecíveis. Crie sua lista personalizada,
            compartilhe com quem você ama e receba cada presente com alegria e organização.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              className="rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary-container active:scale-95"
              onClick={handleCriarLista}
            >
              Criar minha lista
            </button>
            <button className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-8 py-4 text-lg font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white">
              <Search className="h-5 w-5" />
              Buscar uma lista
            </button>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="relative z-10 overflow-hidden rounded-[40px] shadow-2xl transition-transform duration-500 hover:rotate-0 md:rotate-2">
            <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-primary-fixed via-secondary-fixed to-tertiary-fixed">
              <div className="text-center">
                <div className="mb-4 text-7xl">🎂</div>
                <p className="text-lg font-bold text-on-surface-variant">Festa de Aniversário</p>
              </div>
            </div>
          </div>

          {/* Floating card: gift */}
          <div className="absolute -top-6 -right-6 z-20 hidden animate-bounce rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm md:block">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-confetti-yellow">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Novo Presente!</p>
                <p className="text-sm text-on-surface-variant italic">Playstation 5</p>
              </div>
            </div>
          </div>

          {/* Floating card: guests */}
          <div className="absolute -bottom-10 -left-10 z-20 hidden rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm [animation-delay:1s] md:block">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">+12 Convidados</p>
                <p className="text-sm text-on-surface-variant">confirmaram presença</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

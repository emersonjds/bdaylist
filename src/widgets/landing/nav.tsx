"use client";

import { Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";

export function Nav() {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  async function handleSignIn() {
    await signInWithGoogle();
    router.push("/painel");
  }

  return (
    <nav className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-surface px-6 shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container">
          <span className="text-lg font-extrabold text-white">B</span>
        </div>
        <span className="text-xl font-extrabold text-primary">BdayList</span>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        <a
          className="text-sm font-bold tracking-wide text-on-surface-variant transition-colors hover:text-primary"
          href="#how-it-works"
        >
          Como funciona
        </a>
        <a
          className="text-sm font-bold tracking-wide text-on-surface-variant transition-colors hover:text-primary"
          href="#testimonials"
        >
          Depoimentos
        </a>
        <a
          className="text-sm font-bold tracking-wide text-on-surface-variant transition-colors hover:text-primary"
          href="#faq"
        >
          Dúvidas
        </a>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="hidden rounded-full border-2 border-primary px-6 py-2 text-sm font-bold text-primary transition-transform hover:scale-105 md:block"
          onClick={handleSignIn}
        >
          Entrar
        </button>
        <button
          aria-label="Abrir menu"
          className="text-primary md:hidden"
          onClick={handleSignIn}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-primary-container shadow-sm">
          <User className="h-5 w-5 text-white" />
        </div>
      </div>
    </nav>
  );
}

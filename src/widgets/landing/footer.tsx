"use client";

import { useState } from "react";
import { Home, Gift, Users, User, Plus } from "lucide-react";
import { useAuth } from "@/features/auth";

const linksPlataforma = [
  { label: "Criar Lista", href: "#" },
  { label: "Buscar Evento", href: "#" },
  { label: "Como Funciona", href: "#how-it-works" },
  { label: "Exemplos", href: "#" },
];

const linksAjuda = [
  { label: "Central de Ajuda", href: "#" },
  { label: "Segurança", href: "#" },
  { label: "Privacidade", href: "#" },
  { label: "Termos de Uso", href: "#" },
];

const bottomNavItems = [
  { icon: Home, label: "Início", href: "#", active: true },
  { icon: Gift, label: "Presentes", href: "#", active: false },
  { icon: Users, label: "Convidados", href: "#", active: false },
  { icon: User, label: "Perfil", href: "#", active: false },
];

export function Footer() {
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");

  return (
    <>
      <footer className="bg-surface-container px-6 py-12 pb-24 md:pb-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container">
                  <span className="text-sm font-extrabold text-white">B</span>
                </div>
                <span className="text-xl font-extrabold text-primary">
                  BdayList
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">
                A plataforma que transforma seus sonhos em realidade através da
                generosidade de quem te ama.
              </p>
            </div>

            {/* Plataforma */}
            <div>
              <h4 className="mb-6 text-sm font-bold text-on-surface">
                Plataforma
              </h4>
              <ul className="space-y-4">
                {linksPlataforma.map((link) => (
                  <li key={link.label}>
                    <a
                      className="text-sm text-on-surface-variant transition-colors hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ajuda */}
            <div>
              <h4 className="mb-6 text-sm font-bold text-on-surface">Ajuda</h4>
              <ul className="space-y-4">
                {linksAjuda.map((link) => (
                  <li key={link.label}>
                    <a
                      className="text-sm text-on-surface-variant transition-colors hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="mb-6 text-sm font-bold text-on-surface">
                Newsletter
              </h4>
              <p className="mb-4 text-sm text-on-surface-variant">
                Receba dicas de como planejar a festa perfeita.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  className="rounded-xl border-2 border-outline-variant text-sm focus:border-secondary focus:ring-0"
                  placeholder="Seu melhor e-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="rounded-xl bg-secondary py-2 text-sm font-bold text-white transition-opacity hover:opacity-90">
                  Assinar
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-8 md:flex-row">
            <p className="text-xs text-on-surface-variant">
              © {new Date().getFullYear()} BdayList — Transformando desejos em
              festas.
            </p>
            <div className="flex gap-6">
              {["Termos de Uso", "Privacidade", "Contato"].map((item) => (
                <a
                  key={item}
                  className="text-xs text-on-surface-variant transition-colors hover:text-primary"
                  href="#"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface-container-lowest px-4 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              className={`relative flex flex-col items-center justify-center transition-colors ${
                item.active
                  ? "text-primary after:absolute after:-bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-primary after:content-['']"
                  : "text-on-surface-variant hover:text-primary"
              }`}
              href={item.href}
            >
              <Icon className="h-6 w-6" style={{ fill: item.active ? "currentColor" : "none" }} />
              <span className="mt-0.5 text-[10px] font-bold">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* FAB */}
      <button
        aria-label="Criar Lista"
        className="group fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-all hover:scale-110 active:scale-95 md:bottom-10"
        onClick={signInWithGoogle}
      >
        <Plus className="h-7 w-7" />
        <span className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-lg bg-on-surface px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          Criar Lista
        </span>
      </button>
    </>
  );
}

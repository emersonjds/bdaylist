"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gift, Users, User } from "lucide-react";
import { cn } from "@/shared/lib/cn";

const NAV_ITEMS = [
  { href: "/painel", rotulo: "Início", icone: Home },
  { href: "/painel/presentes", rotulo: "Presentes", icone: Gift },
  { href: "/painel/convidados", rotulo: "Convidados", icone: Users },
  { href: "/painel/perfil", rotulo: "Perfil", icone: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around h-16 px-4 bg-surface-container-lowest border-t border-outline-variant shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
      {NAV_ITEMS.map(({ href, rotulo, icone: Icone }) => {
        const ativa =
          href === "/painel"
            ? pathname === "/painel"
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={ativa ? "page" : undefined}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90",
              ativa
                ? "text-primary after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full"
                : "text-on-surface-variant hover:text-primary",
            )}
          >
            <Icone className="h-6 w-6" />
            <span className="font-bold text-[12px] leading-4 tracking-[0.05em]">
              {rotulo}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gift, Users, User } from "lucide-react";
import { cn } from "@/shared/lib/cn";

const NAV_ITEMS = [
  { href: "/dashboard", rotulo: "Início", icone: Home },
  { href: "/dashboard", rotulo: "Presentes", icone: Gift },
  { href: "/dashboard", rotulo: "Convidados", icone: Users },
  { href: "/dashboard", rotulo: "Perfil", icone: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface-container-lowest px-4 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)]">
      {NAV_ITEMS.map(({ href, rotulo, icone: Icone }) => {
        const ativa = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={ativa ? "page" : undefined}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90",
              ativa
                ? "text-primary after:absolute after:-bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            <Icone className="h-6 w-6" />
            <span className="text-[12px] leading-4 font-bold tracking-[0.05em]">{rotulo}</span>
          </Link>
        );
      })}
    </nav>
  );
}

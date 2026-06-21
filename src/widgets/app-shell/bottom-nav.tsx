"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import { NAV_ITEMS } from "./nav-items";
import { isNavItemActive } from "./use-active-nav";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface-container-lowest px-4 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isNavItemActive(pathname, item);

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90",
              active
                ? "text-primary after:absolute after:-bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-[12px] leading-4 font-bold tracking-[0.05em]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import { NAV_ITEMS } from "./nav-items";
import { isNavItemActive } from "./use-active-nav";

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
    >
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(pathname, item);

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative pb-1 text-sm font-bold tracking-[0.05em] uppercase transition-colors",
              active
                ? "text-primary after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

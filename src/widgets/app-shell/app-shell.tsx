"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "@/features/auth";
import { BottomNav } from "./bottom-nav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user } = useAuth();

  const avatarSrc =
    user?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nome ?? "U")}&background=FF5A70&color=fff&size=80`;

  return (
    <>
      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 h-16 bg-surface shadow-[0px_10px_30px_rgba(255,90,112,0.08)]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Menu"
            className="rounded-full p-2 transition-colors hover:bg-surface-container active:scale-95"
          >
            <Menu className="h-6 w-6 text-primary" />
          </button>
          <span className="text-2xl font-extrabold tracking-tight text-primary">
            BdayList
          </span>
        </div>

        {user && (
          <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-primary transition-transform hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={`Avatar de ${user.nome}`}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </header>

      <main className="mx-auto min-h-screen max-w-[1200px] px-4 pb-32 pt-24 md:px-6">
        {children}
      </main>

      <BottomNav />
    </>
  );
}

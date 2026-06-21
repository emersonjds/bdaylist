"use client";

import { Calendar, Sparkles, MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useGifts } from "@/features/manage-gifts/use-gifts";
import { Card } from "@/shared/ui";

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { dashboard, isLoading } = useGifts();

  const avatarSrc =
    user?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&background=FF5A70&color=fff&size=160`;

  const event = dashboard?.event;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">Perfil</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Seus dados e os detalhes da sua festa.</p>
      </header>

      <Card className="mb-6 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarSrc} alt={`Avatar de ${user?.name ?? ""}`} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-on-surface">{user?.name ?? "Aniversariante"}</h2>
          <p className="mt-1 truncate text-sm text-on-surface-variant">{user?.email}</p>
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <h3 className="mb-4 text-lg font-bold text-on-surface">Minha Festa</h3>
        {isLoading || !event ? (
          <p className="text-sm text-on-surface-variant">Carregando...</p>
        ) : (
          <dl className="space-y-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <dt className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Evento</dt>
                <dd className="font-semibold text-on-surface">{event.title}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <dt className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Data</dt>
                <dd className="font-semibold text-on-surface">{formatDate(event.birthDate)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <dt className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Mensagem</dt>
                <dd className="font-semibold text-on-surface">{event.message}</dd>
              </div>
            </div>
          </dl>
        )}
      </Card>

      <button
        type="button"
        onClick={signOut}
        className="inline-flex items-center gap-2 rounded-full border-2 border-error/40 px-6 py-2.5 text-sm font-bold text-error transition-all hover:bg-error/5 active:scale-95"
      >
        <LogOut className="h-4 w-4" />
        Sair da conta
      </button>
    </>
  );
}

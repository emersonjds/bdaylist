import { Cake } from "lucide-react";
import { CountdownBadge } from "@/entities/event/countdown-badge";

interface HostHeaderProps {
  title: string;
  message: string;
  birthDate: string;
  coverUrl: string;
  hostName: string;
  onRsvp?: () => void;
}

export function HostHeader({
  title,
  message,
  birthDate,
  coverUrl,
  hostName,
  onRsvp,
}: HostHeaderProps) {
  return (
    <section className="mb-12 text-center">
      {/* Avatar / Cover with cake badge */}
      <div className="relative mb-6 inline-block">
        <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-primary bg-surface p-1 shadow-xl md:h-40 md:w-40">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt={hostName} className="h-full w-full rounded-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-container">
              <span className="text-4xl font-extrabold text-primary">
                {hostName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="absolute -right-2 -bottom-2 animate-bounce rounded-full bg-confetti-yellow p-2 shadow-lg">
          <Cake className="h-5 w-5 text-on-tertiary-container" />
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-extrabold text-primary md:text-4xl">{title}</h1>

      <div className="mb-6">
        <CountdownBadge birthDate={birthDate} />
      </div>

      <p className="mx-auto max-w-2xl text-lg text-on-surface-variant">{message}</p>

      {/* Mobile-only RSVP button */}
      {onRsvp && (
        <div className="mt-8 md:hidden">
          <button
            type="button"
            onClick={onRsvp}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-on-primary shadow-xl transition-transform active:scale-95"
          >
            Confirmar Presença (RSVP)
          </button>
        </div>
      )}
    </section>
  );
}

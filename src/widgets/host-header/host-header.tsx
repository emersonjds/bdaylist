import { Cake } from "lucide-react";
import { CountdownBadge } from "@/entities/evento/countdown-badge";

interface HostHeaderProps {
  titulo: string;
  mensagem: string;
  dataAniversario: string;
  capaUrl: string;
  hostNome: string;
  onRsvp?: () => void;
}

export function HostHeader({
  titulo,
  mensagem,
  dataAniversario,
  capaUrl,
  hostNome,
  onRsvp,
}: HostHeaderProps) {
  return (
    <section className="mb-12 text-center">
      {/* Avatar / Cover with cake badge */}
      <div className="relative inline-block mb-6">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary p-1 bg-surface shadow-xl mx-auto overflow-hidden">
          {capaUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capaUrl}
              alt={hostNome}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-primary-container flex items-center justify-center">
              <span className="text-4xl font-extrabold text-primary">
                {hostNome.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-confetti-yellow p-2 rounded-full shadow-lg animate-bounce">
          <Cake className="w-5 h-5 text-on-tertiary-container" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
        {titulo}
      </h1>

      <div className="mb-6">
        <CountdownBadge dataAniversario={dataAniversario} />
      </div>

      <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
        {mensagem}
      </p>

      {/* Mobile-only RSVP button */}
      {onRsvp && (
        <div className="mt-8 md:hidden">
          <button
            type="button"
            onClick={onRsvp}
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
          >
            Confirmar Presença (RSVP)
          </button>
        </div>
      )}
    </section>
  );
}

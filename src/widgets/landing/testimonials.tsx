import { Star } from "lucide-react";

const testimonials = [
  {
    id: "1",
    text: "Nunca foi tão fácil organizar meus presentes. Pude focar na festa enquanto a BdayList cuidava de tudo. Cada convidado sabia exatamente o que presentear!",
    author: "Mariana Silva",
    detail: "Comemorou 25 anos",
    avatarBg: "bg-primary-fixed",
    avatarEmoji: "😊",
  },
  {
    id: "2",
    text: "Para a festa do meu filho foi perfeito. Os convidados elogiaram a praticidade de não precisar carregar caixas de presentes para o buffet.",
    author: "Ricardo Gomes",
    detail: "Pai do Arthur (5 anos)",
    avatarBg: "bg-secondary-fixed",
    avatarEmoji: "👨",
  },
  {
    id: "3",
    text: "A lista compartilhada é fantástica. Todos os amigos conseguiram coordenar os presentes e eu recebi exatamente o que queria na minha formatura!",
    author: "André Martins",
    detail: "Formatura de Medicina",
    avatarBg: "bg-tertiary-fixed",
    avatarEmoji: "🎓",
  },
];

function Stars() {
  return (
    <div className="mb-6 flex gap-1 text-tertiary">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-5 w-5 fill-current" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      className="relative overflow-hidden bg-surface-container-low px-6 py-20 md:py-[80px]"
      id="testimonials"
    >
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-on-surface">Quem usou, amou!</h2>
          <p className="mx-auto max-w-2xl text-on-surface-variant">
            Milhares de aniversariantes já transformaram suas festas com a BdayList. Confira alguns
            relatos:
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex h-full flex-col rounded-[32px] border border-outline-variant/30 bg-white p-8 shadow-sm"
            >
              <Stars />
              <p className="mb-8 flex-1 text-base text-on-surface italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${testimonial.avatarBg}`}
                >
                  {testimonial.avatarEmoji}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{testimonial.author}</p>
                  <p className="text-xs text-on-surface-variant">{testimonial.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

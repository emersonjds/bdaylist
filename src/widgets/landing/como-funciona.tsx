import { PenLine, Share2, Gift } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PenLine,
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
    rotate: "-rotate-6",
    title: "Crie sua lista",
    description:
      "Adicione seus presentes favoritos ou escolha entre nossas sugestões. Personalize cada item com nome, descrição e link da loja.",
  },
  {
    number: "02",
    icon: Share2,
    iconBg: "bg-secondary-fixed",
    iconColor: "text-secondary",
    rotate: "rotate-3",
    title: "Compartilhe",
    description:
      "Envie o link exclusivo para seus amigos e familiares via WhatsApp ou redes sociais de forma prática.",
  },
  {
    number: "03",
    icon: Gift,
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-tertiary",
    rotate: "-rotate-2",
    title: "Receba seus presentes",
    description:
      "Seus convidados reservam os presentes diretamente na lista. Você sabe exatamente o que vai ganhar e evita presentes repetidos.",
  },
];

export function ComoFunciona() {
  return (
    <section
      className="bg-surface px-6 py-20 md:py-[80px]"
      id="how-it-works"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-on-surface">
            Como funciona? É simples assim:
          </h2>
          <div className="mx-auto h-1.5 w-24 rounded-full bg-primary" />
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative rounded-[32px] bg-white p-8 shadow-[0px_10px_30px_rgba(255,90,112,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(255,90,112,0.1)]"
              >
                <div
                  className={`mb-8 flex h-20 w-20 items-center justify-center rounded-2xl transition-transform ${step.iconBg} ${step.rotate} group-hover:rotate-0`}
                >
                  <Icon className={`h-9 w-9 ${step.iconColor}`} />
                </div>
                <span className="absolute right-8 top-8 z-0 text-6xl font-extrabold text-surface-container-high">
                  {step.number}
                </span>
                <h3 className="relative z-10 mb-4 text-2xl font-bold text-on-surface">
                  {step.title}
                </h3>
                <p className="relative z-10 text-base text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

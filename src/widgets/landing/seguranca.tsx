import { ShieldCheck, Link, Users } from "lucide-react";

const itens = [
  {
    icon: ShieldCheck,
    titulo: "Reservas sem duplicação",
    descricao:
      "O sistema garante que cada presente só possa ser reservado por uma pessoa. Sem conflitos, sem surpresas.",
  },
  {
    icon: Link,
    titulo: "Link exclusivo e seguro",
    descricao:
      "Sua lista fica protegida por um link de alta entropia. Só quem receber o link consegue acessar.",
  },
  {
    icon: Users,
    titulo: "Experiência simples para convidados",
    descricao:
      "Seus convidados não precisam criar conta. Basta acessar o link, escolher e reservar.",
  },
];

export function Seguranca() {
  return (
    <section className="bg-surface-container-low px-6 py-20 md:py-[80px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-on-surface">
            Feito para ser simples e seguro
          </h2>
          <p className="mx-auto max-w-xl text-base text-on-surface-variant">
            Cada detalhe foi pensado para que você e seus convidados tenham a
            melhor experiência possível.
          </p>
          <div className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-secondary" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {itens.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.titulo}
                className="rounded-[32px] bg-white p-8 shadow-[0px_10px_30px_rgba(255,90,112,0.05)]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-fixed">
                  <Icon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-on-surface">
                  {item.titulo}
                </h3>
                <p className="text-base text-on-surface-variant">
                  {item.descricao}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

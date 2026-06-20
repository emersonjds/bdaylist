import { Nav } from "@/widgets/landing/nav";
import { Hero } from "@/widgets/landing/hero";
import { ComoFunciona } from "@/widgets/landing/como-funciona";
import { Inspiracao } from "@/widgets/landing/inspiracao";
import { Seguranca } from "@/widgets/landing/seguranca";
import { Depoimentos } from "@/widgets/landing/depoimentos";
import { Faq } from "@/widgets/landing/faq";
import { Footer } from "@/widgets/landing/footer";

const faqItems = [
  {
    id: "1",
    pergunta: "Como funciona a reserva de presentes?",
    resposta:
      "O convidado acessa sua lista pelo link exclusivo, escolhe um presente e o reserva. Isso garante que você receba o que deseja, sem presentes repetidos.",
  },
  {
    id: "2",
    pergunta: "Criar minha lista é gratuito?",
    resposta:
      "Criar e compartilhar sua lista é 100% gratuito. Não há taxas ou cobranças de nenhum tipo para você ou seus convidados.",
  },
  {
    id: "3",
    pergunta: "Meus convidados precisam criar uma conta?",
    resposta:
      "Não! Seus convidados acessam sua lista diretamente pelo link que você compartilha, sem precisar de cadastro ou senha.",
  },
];

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ComoFunciona />
        <Inspiracao />
        <Seguranca />
        <Depoimentos />
        <section className="px-6 py-20 md:py-[80px]" id="faq">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-on-surface">Dúvidas Frequentes</h2>
              <p className="text-on-surface-variant">
                Tudo o que você precisa saber para começar agora mesmo.
              </p>
            </div>
            <Faq items={faqItems} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Faq } from "./faq";

const items = [
  {
    id: "1",
    pergunta: "Como funciona a reserva de presentes?",
    resposta: "O convidado escolhe um presente e o reserva pelo link.",
  },
  {
    id: "2",
    pergunta: "Criar minha lista é gratuito?",
    resposta: "Sim, 100% gratuito para você e seus convidados.",
  },
];

test("clicando na pergunta revela a resposta", async () => {
  render(<Faq items={items} />);
  expect(
    screen.queryByText("O convidado escolhe um presente e o reserva pelo link."),
  ).not.toBeInTheDocument();
  await userEvent.click(
    screen.getByText("Como funciona a reserva de presentes?"),
  );
  expect(
    screen.getByText("O convidado escolhe um presente e o reserva pelo link."),
  ).toBeInTheDocument();
});

test("clicar em outra pergunta fecha a primeira (apenas uma aberta por vez)", async () => {
  render(<Faq items={items} />);
  await userEvent.click(
    screen.getByText("Como funciona a reserva de presentes?"),
  );
  expect(
    screen.getByText("O convidado escolhe um presente e o reserva pelo link."),
  ).toBeInTheDocument();
  await userEvent.click(screen.getByText("Criar minha lista é gratuito?"));
  expect(
    screen.queryByText(
      "O convidado escolhe um presente e o reserva pelo link.",
    ),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText("Sim, 100% gratuito para você e seus convidados."),
  ).toBeInTheDocument();
});

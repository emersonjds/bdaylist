import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Faq } from "./faq";

const items = [
  {
    id: "1",
    question: "Como funciona a reserva de presentes?",
    answer: "O convidado escolhe um presente e o reserva pelo link.",
  },
  {
    id: "2",
    question: "Criar minha lista é gratuito?",
    answer: "Sim, 100% gratuito para você e seus convidados.",
  },
];

test("clicking a question reveals the answer", async () => {
  render(<Faq items={items} />);
  expect(
    screen.queryByText("O convidado escolhe um presente e o reserva pelo link.")
  ).not.toBeInTheDocument();
  await userEvent.click(screen.getByText("Como funciona a reserva de presentes?"));
  expect(
    screen.getByText("O convidado escolhe um presente e o reserva pelo link.")
  ).toBeInTheDocument();
});

test("clicking another question closes the first (only one open at a time)", async () => {
  render(<Faq items={items} />);
  await userEvent.click(screen.getByText("Como funciona a reserva de presentes?"));
  expect(
    screen.getByText("O convidado escolhe um presente e o reserva pelo link.")
  ).toBeInTheDocument();
  await userEvent.click(screen.getByText("Criar minha lista é gratuito?"));
  expect(
    screen.queryByText("O convidado escolhe um presente e o reserva pelo link.")
  ).not.toBeInTheDocument();
  expect(screen.getByText("Sim, 100% gratuito para você e seus convidados.")).toBeInTheDocument();
});

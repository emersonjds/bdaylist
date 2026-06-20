import { render, screen } from "@testing-library/react";
import { GiftCard } from "./gift-card";

const base = {
  id: "1",
  eventoId: "1",
  nome: "Câmera Instantânea",
  descricao: "x",
  imagemUrl: "",
  precoReferencia: 450,
  linkLoja: "",
  maisDesejado: false,
  emGrupo: false,
  status: "disponivel" as const,
};

test("mostra nome, preço formatado e botão presentear", () => {
  render(<GiftCard presente={base} onPresentear={() => {}} />);
  expect(screen.getByText("Câmera Instantânea")).toBeInTheDocument();
  expect(screen.getByText("R$ 450,00")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Presentear/ })).toBeEnabled();
});

test("desabilita quando reservado", () => {
  render(
    <GiftCard presente={{ ...base, status: "reservado" }} onPresentear={() => {}} />,
  );
  expect(
    screen.getByRole("button", { name: /Reservado|Presentear/ }),
  ).toBeDisabled();
});

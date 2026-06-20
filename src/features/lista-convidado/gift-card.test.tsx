import { describe, it, expect, vi, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { GiftCard } from "./gift-card";
import type { Presente } from "@/entities/presente";

const base: Presente = {
  id: "1",
  eventoId: "1",
  nome: "Câmera Instantânea",
  descricao: "x",
  imagemUrl: "",
  precoReferencia: 450,
  linkLoja: "",
  maisDesejado: false,
  emGrupo: false,
  status: "disponivel",
};

const grupo: Presente = {
  id: "p4",
  eventoId: "e1",
  nome: "Cafeteira",
  descricao: "Meta nova casa",
  imagemUrl: "",
  precoReferencia: 1500,
  linkLoja: "",
  maisDesejado: false,
  emGrupo: true,
  status: "disponivel",
  metaGrupo: { alvo: 1500, arrecadado: 600 },
};

test("mostra nome, preço formatado e botão presentear", () => {
  render(<GiftCard presente={base} onPresentear={() => {}} />);
  expect(screen.getByText("Câmera Instantânea")).toBeInTheDocument();
  expect(screen.getByText("R$ 450,00")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Presentear/ })).toBeEnabled();
});

test("desabilita quando reservado", () => {
  render(<GiftCard presente={{ ...base, status: "reservado" }} onPresentear={() => {}} />);
  expect(screen.getByRole("button", { name: /Reservado|Presentear/ })).toBeDisabled();
});

describe("GiftCard — presente em grupo", () => {
  it("mostra barra de progresso e botão Contribuir", () => {
    render(<GiftCard presente={grupo} onPresentear={vi.fn()} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByRole("button", { name: /Contribuir/ })).toBeVisible();
  });
});

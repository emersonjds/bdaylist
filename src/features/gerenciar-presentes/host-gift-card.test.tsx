import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HostGiftCard } from "./host-gift-card";
import type { Presente } from "@/entities/presente";

const base: Presente = {
  id: "p4", eventoId: "e1", nome: "Cafeteira", descricao: "",
  imagemUrl: "", precoReferencia: 1500, linkLoja: "", maisDesejado: false,
  emGrupo: true, status: "disponivel", metaGrupo: { alvo: 1500, arrecadado: 600 },
};

describe("HostGiftCard — presente em grupo", () => {
  it("mostra o percentual arrecadado", () => {
    render(<HostGiftCard presente={base} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/40% Arrecadado/)).toBeVisible();
  });
});

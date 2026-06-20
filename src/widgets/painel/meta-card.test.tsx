import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetaCard } from "./meta-card";

describe("MetaCard", () => {
  it("mostra o percentual e os valores da meta", () => {
    render(<MetaCard meta={{ alvo: 5000, atingido: 2450 }} />);
    expect(screen.getByText("Meta de Presentes")).toBeVisible();
    expect(screen.getByText(/49%/)).toBeVisible();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "49");
  });
});

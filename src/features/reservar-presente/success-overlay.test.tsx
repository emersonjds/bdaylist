import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SuccessOverlay } from "./success-overlay";

describe("SuccessOverlay", () => {
  it("comunica reserva (sem pagamento)", () => {
    render(<SuccessOverlay onVoltar={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Presente Reservado!" })).toBeVisible();
  });
});

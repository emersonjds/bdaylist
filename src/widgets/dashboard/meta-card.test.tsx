import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetaCard } from "./meta-card";

describe("MetaCard", () => {
  it("shows goal percentage and values", () => {
    render(<MetaCard meta={{ target: 5000, reached: 2450 }} />);
    expect(screen.getByText("Meta de Presentes")).toBeVisible();
    expect(screen.getByText(/49%/)).toBeVisible();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "49");
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HostGiftCard } from "./host-gift-card";
import type { Gift } from "@/entities/gift";

const base: Gift = {
  id: "p4", eventId: "e1", name: "Cafeteira", description: "",
  imageUrl: "", referencePrice: 1500, storeLink: "", mostWanted: false,
  isGroup: true, status: "available", groupGoal: { target: 1500, collected: 600 },
};

describe("HostGiftCard — group gift", () => {
  it("shows the collected percentage", () => {
    render(<HostGiftCard gift={base} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/40% Arrecadado/)).toBeVisible();
  });
});

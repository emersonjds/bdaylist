import { describe, it, expect, vi, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { GiftCard } from "./gift-card";
import type { Gift } from "@/entities/gift";

const base: Gift = {
  id: "1",
  eventId: "1",
  name: "Câmera Instantânea",
  description: "x",
  imageUrl: "",
  referencePrice: 450,
  storeLink: "",
  mostWanted: false,
  isGroup: false,
  status: "available",
};

const grupo: Gift = {
  id: "p4",
  eventId: "e1",
  name: "Cafeteira",
  description: "Meta nova casa",
  imageUrl: "",
  referencePrice: 1500,
  storeLink: "",
  mostWanted: false,
  isGroup: true,
  status: "available",
  groupGoal: { target: 1500, collected: 600 },
};

test("shows gift name, formatted price, and action button", () => {
  render(<GiftCard gift={base} onGiftClick={() => {}} />);
  expect(screen.getByText("Câmera Instantânea")).toBeInTheDocument();
  expect(screen.getByText("R$ 450,00")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Presentear/ })).toBeEnabled();
});

test("disables when reserved", () => {
  render(<GiftCard gift={{ ...base, status: "reserved" }} onGiftClick={() => {}} />);
  expect(screen.getByRole("button", { name: /Reservado|Presentear/ })).toBeDisabled();
});

describe("GiftCard — group gift", () => {
  it("shows progress bar and Contribuir button", () => {
    render(<GiftCard gift={grupo} onGiftClick={vi.fn()} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByRole("button", { name: /Contribuir/ })).toBeVisible();
  });
});

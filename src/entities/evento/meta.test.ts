import { describe, it, expect } from "vitest";
import { percentualMeta } from "./meta";

describe("percentualMeta", () => {
  it("calcula o percentual atingido arredondado", () => {
    expect(percentualMeta({ alvo: 5000, atingido: 2450 })).toBe(49);
  });
  it("retorna 0 quando alvo é 0", () => {
    expect(percentualMeta({ alvo: 0, atingido: 100 })).toBe(0);
  });
  it("limita o teto em 100", () => {
    expect(percentualMeta({ alvo: 100, atingido: 250 })).toBe(100);
  });
});

import { describe, it, expect } from "vitest";
import { percentualGrupo } from "./meta-grupo";

describe("percentualGrupo", () => {
  it("calcula o percentual arrecadado arredondado", () => {
    expect(percentualGrupo({ alvo: 1500, arrecadado: 600 })).toBe(40);
  });
  it("retorna 0 quando alvo é 0", () => {
    expect(percentualGrupo({ alvo: 0, arrecadado: 50 })).toBe(0);
  });
  it("limita o teto em 100", () => {
    expect(percentualGrupo({ alvo: 100, arrecadado: 300 })).toBe(100);
  });
});

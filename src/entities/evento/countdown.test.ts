import { diasRestantes, rotuloContagem } from "./countdown";

test("conta dias inteiros restantes", () => {
  expect(diasRestantes("2026-07-02", new Date("2026-06-20T12:00:00"))).toBe(12);
});

test("rótulos pt-BR", () => {
  expect(rotuloContagem(0)).toBe("É hoje! 🎉");
  expect(rotuloContagem(1)).toBe("Falta 1 dia");
  expect(rotuloContagem(12)).toBe("Faltam 12 dias");
});

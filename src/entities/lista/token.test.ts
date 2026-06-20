import { gerarListToken } from "./token";

test("gera token único e não sequencial", () => {
  const a = gerarListToken();
  const b = gerarListToken();
  expect(a).not.toBe(b);
  expect(a.length).toBeGreaterThanOrEqual(16);
});

import { daysRemaining, countdownLabel } from "./countdown";

test("counts whole days remaining", () => {
  expect(daysRemaining("2026-07-02", new Date("2026-06-20T12:00:00"))).toBe(12);
});

test("pt-BR countdown labels", () => {
  expect(countdownLabel(0)).toBe("É hoje! 🎉");
  expect(countdownLabel(1)).toBe("Falta 1 dia");
  expect(countdownLabel(12)).toBe("Faltam 12 dias");
});

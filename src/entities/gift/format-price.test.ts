import { formatPrice } from "./format-price";

test("formats as BRL currency", () => {
  expect(formatPrice(1299)).toBe("R$ 1.299,00");
});

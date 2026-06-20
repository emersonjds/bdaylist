import { formatPreco } from "./format-preco";

test("formata em BRL", () => {
  expect(formatPreco(1299)).toBe("R$ 1.299,00");
});

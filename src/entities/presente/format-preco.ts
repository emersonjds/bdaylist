const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatPreco(valor: number): string {
  return formatter.format(valor);
}

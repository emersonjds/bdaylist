import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLista } from "./use-lista";

function createTestClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

interface TestComponentProps {
  token: string;
}

function TestComponent({ token }: TestComponentProps) {
  const { presentesFiltrados, setPriceFaixa, isLoading } = useLista(token);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <button type="button" onClick={() => setPriceFaixa("ate100")}>
        filtrar-ate100
      </button>
      <ul>
        {presentesFiltrados.map((p) => (
          <li key={p.id}>{p.nome}</li>
        ))}
      </ul>
    </div>
  );
}

test("carrega 5 presentes do token", async () => {
  const client = createTestClient();
  render(
    <QueryClientProvider client={client}>
      <TestComponent token="festa-rodrigo-25" />
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
  );
  expect(screen.getAllByRole("listitem")).toHaveLength(5);
});

test("filtro ate100 retorna apenas presentes até R$ 100", async () => {
  const client = createTestClient();
  render(
    <QueryClientProvider client={client}>
      <TestComponent token="festa-rodrigo-25" />
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
  );

  await userEvent.click(screen.getByRole("button", { name: "filtrar-ate100" }));

  // Seed: only p5 "Livro Edição Luxo" (R$89,90) is ≤ R$100
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRegistry } from "./use-registry";

function createTestClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

interface TestComponentProps {
  token: string;
}

function TestComponent({ token }: TestComponentProps) {
  const { filteredGifts, setPriceRange, isLoading } = useRegistry(token);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <button type="button" onClick={() => setPriceRange("upTo100")}>
        filter-upTo100
      </button>
      <ul>
        {filteredGifts.map((g) => (
          <li key={g.id}>{g.name}</li>
        ))}
      </ul>
    </div>
  );
}

test("loads 5 gifts for the token", async () => {
  const client = createTestClient();
  render(
    <QueryClientProvider client={client}>
      <TestComponent token="festa-rodrigo-25" />
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.queryByText("Carregando...")).not.toBeInTheDocument());
  expect(screen.getAllByRole("listitem")).toHaveLength(5);
});

test("upTo100 filter returns only gifts up to R$ 100", async () => {
  const client = createTestClient();
  render(
    <QueryClientProvider client={client}>
      <TestComponent token="festa-rodrigo-25" />
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.queryByText("Carregando...")).not.toBeInTheDocument());

  await userEvent.click(screen.getByRole("button", { name: "filter-upTo100" }));

  // Seed: only p5 "Livro Edição Luxo" (R$89,90) is ≤ R$100
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth";
import { usePresentes } from "./use-presentes";

const mockUser = {
  id: "host-1",
  nome: "Rodrigo",
  email: "rodrigo@example.com",
  avatarUrl: "",
};

function createTestClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function TestComponent() {
  const { painel, isLoading, criar } = usePresentes();

  if (isLoading) return <div>Carregando...</div>;
  if (!painel) return <div>Sem dados</div>;

  return (
    <div>
      <span data-testid="count">{painel.presentes.length}</span>
      <button type="button" onClick={() => criar({ nome: "Novo Presente" })}>
        Adicionar
      </button>
    </div>
  );
}

function Wrapper({ client }: { client: QueryClient }) {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  localStorage.setItem("bday.session", JSON.stringify(mockUser));
});

afterEach(() => {
  localStorage.clear();
});

test("carrega presentes do painel autenticado", async () => {
  const client = createTestClient();
  render(<Wrapper client={client} />);

  await waitFor(() => {
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });

  expect(screen.getByTestId("count")).toHaveTextContent("5");
});

test("criar adiciona um presente à lista do painel", async () => {
  const client = createTestClient();
  render(<Wrapper client={client} />);

  await waitFor(() => {
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });

  expect(screen.getByTestId("count")).toHaveTextContent("5");

  await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));

  await waitFor(() => {
    expect(screen.getByTestId("count")).toHaveTextContent("6");
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecadoForm } from "./recado-form";
import { RecadoList } from "./recado-list";

function createTestClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

test("posta um recado e ele aparece na lista (MSW round-trip)", async () => {
  const client = createTestClient();

  render(
    <QueryClientProvider client={client}>
      <RecadoForm eventoId="evento-1" />
      <RecadoList eventoId="evento-1" />
    </QueryClientProvider>,
  );

  await userEvent.type(screen.getByLabelText(/Seu nome/i), "Maria");
  await userEvent.type(screen.getByLabelText(/Mensagem/i), "Feliz aniversário!");
  await userEvent.click(screen.getByRole("button", { name: /Enviar Recado/i }));

  await waitFor(() =>
    expect(screen.getByText(/Feliz aniversário!/)).toBeInTheDocument(),
  );
  expect(screen.getByText("Maria")).toBeInTheDocument();
});

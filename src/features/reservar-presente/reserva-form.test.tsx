import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReservaForm } from "./reserva-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
}));

function createTestClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

const gift = {
  id: "p3",
  eventoId: "1",
  nome: "Kit Velas",
  descricao: "",
  imagemUrl: "",
  precoReferencia: 120,
  linkLoja: "",
  maisDesejado: false,
  emGrupo: false,
  status: "disponivel" as const,
};

test("envia a reserva e chama onSuccess", async () => {
  const onSuccess = vi.fn();
  const client = createTestClient();
  render(
    <QueryClientProvider client={client}>
      <ReservaForm gift={gift} onSuccess={onSuccess} />
    </QueryClientProvider>
  );
  await userEvent.type(screen.getByLabelText(/Seu nome/i), "Ana");
  await userEvent.type(screen.getByLabelText(/Mensagem Carinhosa/i), "Feliz aniversário!");
  await userEvent.click(screen.getByRole("button", { name: /Finalizar Presente/i }));
  await waitFor(() => expect(onSuccess).toHaveBeenCalled());
});

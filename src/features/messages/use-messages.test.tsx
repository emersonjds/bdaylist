import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MessageForm } from "./message-form";
import { MessageList } from "./message-list";

function createTestClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

test("posts a message and it appears in the list (MSW round-trip)", async () => {
  const client = createTestClient();

  render(
    <QueryClientProvider client={client}>
      <MessageForm eventId="event-1" />
      <MessageList eventId="event-1" />
    </QueryClientProvider>
  );

  await userEvent.type(screen.getByLabelText(/Seu nome/i), "Maria");
  await userEvent.type(screen.getByLabelText(/Mensagem/i), "Feliz aniversário!");
  await userEvent.click(screen.getByRole("button", { name: /Enviar Recado/i }));

  await waitFor(() => expect(screen.getByText(/Feliz aniversário!/)).toBeInTheDocument());
  expect(screen.getByText("Maria")).toBeInTheDocument();
});

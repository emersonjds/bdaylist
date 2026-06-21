import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RsvpModal } from "./rsvp-modal";

function createTestClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

test("submits name and shows attendance confirmation", async () => {
  const onClose = vi.fn();
  const client = createTestClient();

  render(
    <QueryClientProvider client={client}>
      <RsvpModal open eventId="1" onClose={onClose} />
    </QueryClientProvider>
  );

  await userEvent.type(screen.getByLabelText(/Seu nome/i), "Ana");
  await userEvent.click(screen.getByRole("button", { name: /Confirmar Presença/i }));

  await waitFor(() => expect(screen.getByText("Presença Confirmada!")).toBeInTheDocument());
});

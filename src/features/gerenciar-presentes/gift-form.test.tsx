import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GiftForm } from "./gift-form";

const noopAsync = async () => {};

test("exige nome ao submeter sem preenchimento", async () => {
  render(<GiftForm open onClose={noopAsync} onSubmit={noopAsync} />);

  await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

  await waitFor(() => {
    expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
  });
});

test("chama onSubmit com nome ao submeter formulário válido", async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined);

  render(<GiftForm open onClose={noopAsync} onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/nome do presente/i), "Fone Bluetooth");
  await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ nome: "Fone Bluetooth" }));
  });
});

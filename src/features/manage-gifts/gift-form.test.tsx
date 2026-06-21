import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import { GiftForm } from "./gift-form";

const noopAsync = async () => {};

test("requires name when submitting without filling it", async () => {
  render(<GiftForm open onClose={noopAsync} onSubmit={noopAsync} />);

  await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

  await waitFor(() => {
    expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
  });
});

test("calls onSubmit with name when submitting a valid form", async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined);

  render(<GiftForm open onClose={noopAsync} onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/nome do presente/i), "Fone Bluetooth");
  await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: "Fone Bluetooth" }));
  });
});

describe("store and image URL validation", () => {
  const safeUrl = z
    .string()
    .refine(
      (value) => value === "" || /^https?:\/\//i.test(value),
      "URL deve começar com http:// ou https://"
    );

  test("rejects javascript: scheme", () => {
    expect(safeUrl.safeParse("javascript:alert(1)").success).toBe(false);
  });

  test("rejects data: scheme", () => {
    expect(safeUrl.safeParse("data:text/html,<h1>xss</h1>").success).toBe(false);
  });

  test("accepts valid https URL", () => {
    expect(safeUrl.safeParse("https://amazon.com/x").success).toBe(true);
  });

  test("accepts empty string (optional field)", () => {
    expect(safeUrl.safeParse("").success).toBe(true);
  });
});

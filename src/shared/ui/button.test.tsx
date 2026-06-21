import { render, screen } from "@testing-library/react";
import { Button } from "./button";

test("renders the primary button with a label", () => {
  render(<Button>Presentear</Button>);
  expect(screen.getByRole("button", { name: "Presentear" })).toBeInTheDocument();
});

test("applies the ghost variant", () => {
  render(<Button variant="ghost">Entrar</Button>);
  expect(screen.getByRole("button", { name: "Entrar" }).className).toContain("border-primary");
});

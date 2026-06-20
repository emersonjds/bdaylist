import { render, screen } from "@testing-library/react";
import { Button } from "./button";

test("renderiza o botão primário com rótulo", () => {
  render(<Button>Presentear</Button>);
  expect(screen.getByRole("button", { name: "Presentear" })).toBeInTheDocument();
});

test("aplica a variante ghost", () => {
  render(<Button variant="ghost">Entrar</Button>);
  expect(screen.getByRole("button", { name: "Entrar" }).className).toContain("border-primary");
});

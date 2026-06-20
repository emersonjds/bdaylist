import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./auth-provider";
import { useAuth } from "./use-auth";

function Probe() {
  const { user, signInWithGoogle } = useAuth();
  return <button onClick={() => signInWithGoogle()}>{user ? user.nome : "deslogado"}</button>;
}

test("entra com Google e expõe o usuário mock", async () => {
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );
  expect(screen.getByRole("button", { name: "deslogado" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button"));
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /Rodrigo|.+/ })).not.toHaveTextContent("deslogado")
  );
});

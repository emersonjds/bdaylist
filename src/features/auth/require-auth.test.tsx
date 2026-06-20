import { render, screen } from "@testing-library/react";
import { AuthProvider } from "./auth-provider";
import { RequireAuth } from "./require-auth";

const SESSION_KEY = "bday.session";
const fakeUser = {
  id: "u1",
  nome: "Rodrigo",
  email: "rodrigo@teste.com",
  avatarUrl: "",
};

afterEach(() => {
  localStorage.removeItem(SESSION_KEY);
});

test("sem sessão renderiza o LoginCTA", async () => {
  render(
    <AuthProvider>
      <RequireAuth>
        <p>Conteúdo protegido</p>
      </RequireAuth>
    </AuthProvider>
  );

  expect(await screen.findByRole("button", { name: /Entrar com Google/i })).toBeInTheDocument();
  expect(screen.queryByText("Conteúdo protegido")).not.toBeInTheDocument();
});

test("com sessão no localStorage renderiza children", async () => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(fakeUser));

  render(
    <AuthProvider>
      <RequireAuth>
        <p>Conteúdo protegido</p>
      </RequireAuth>
    </AuthProvider>
  );

  expect(await screen.findByText("Conteúdo protegido")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Entrar com Google/i })).not.toBeInTheDocument();
});

import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";

const DIR = "e2e/auth/evidencias";

test.beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
});

test("exibe CTA de login ao acessar /painel sem sessão e entra com Google", async ({
  page,
}, testInfo) => {
  const proj = testInfo.project.name;

  // 1. Visita /painel sem sessão autenticada
  await page.goto("/painel");

  // Aguarda o MSW inicializar e o LoginCTA aparecer
  await expect(
    page.getByRole("button", { name: "Entrar com Google" }),
  ).toBeVisible({ timeout: 20_000 });

  await page.screenshot({ path: `${DIR}/${proj}-01-login-cta.png` });

  // 2. Clica em "Entrar com Google"
  await page.getByRole("button", { name: "Entrar com Google" }).click();

  // 3. Aguarda o painel carregar após autenticação mockada
  // POST /api/auth/google é interceptado pelo MSW e retorna o usuário Rodrigo
  await expect(page.getByText(/Olá, Rodrigo/)).toBeVisible({
    timeout: 20_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-02-painel-autenticado.png` });
});

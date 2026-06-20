import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";

const DIR = "e2e/painel/evidencias";

const SESSION = {
  id: "host-1",
  nome: "Rodrigo",
  email: "rodrigo@example.com",
  avatarUrl: "",
};

test.beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
});

test.beforeEach(async ({ page }) => {
  // Injeta a sessão autenticada antes de qualquer script da página ser executado
  await page.addInitScript((session) => {
    localStorage.setItem("bday.session", JSON.stringify(session));
  }, SESSION);
});

test("adiciona, edita e remove um presente no painel do aniversariante", async ({
  page,
}, testInfo) => {
  const proj = testInfo.project.name;

  // 1. Navega para o painel já autenticado
  await page.goto("/painel");

  // Aguarda o MSW inicializar e o painel carregar com a saudação
  await expect(page.getByText(/Olá, Rodrigo/)).toBeVisible({
    timeout: 20_000,
  });

  // Aguarda os presentes do seed aparecerem (confirma que GET /api/painel carregou)
  await expect(page.getByText("Fone Bluetooth Premium")).toBeVisible({
    timeout: 15_000,
  });

  // 2. Clica no tile "Adicionar Novo" da grade (sempre visível em mobile e desktop)
  await page.getByRole("button", { name: "Adicionar Novo", exact: true }).click();

  // Aguarda o formulário "Adicionar Presente" abrir
  await expect(
    page.getByRole("heading", { name: "Adicionar Presente", level: 2 }),
  ).toBeVisible({ timeout: 5_000 });

  // 3. Preenche o nome do novo presente
  await page.getByLabel("Nome do Presente").fill("Presente E2E Test");

  // Envia o formulário
  await page.getByRole("button", { name: "Salvar" }).click();

  // 4. Afirma que o novo presente aparece na grade
  await expect(page.getByText("Presente E2E Test")).toBeVisible({
    timeout: 10_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-01-presente-adicionado.png` });

  // 5. Edita o presente recém-adicionado
  await page.getByLabel("Editar Presente E2E Test").click();

  // Aguarda o formulário de edição abrir
  await expect(
    page.getByRole("heading", { name: "Editar Presente", level: 2 }),
  ).toBeVisible({ timeout: 5_000 });

  // Altera o nome
  const nomeInput = page.getByLabel("Nome do Presente");
  await nomeInput.clear();
  await nomeInput.fill("Presente E2E Editado");
  await page.getByRole("button", { name: "Salvar" }).click();

  // 6. Afirma que o nome atualizado aparece na grade
  await expect(page.getByText("Presente E2E Editado")).toBeVisible({
    timeout: 10_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-02-presente-editado.png` });

  // 7. Remove o presente editado
  await page.getByLabel("Remover Presente E2E Editado").click();

  // 8. Afirma que o presente desapareceu da grade
  await expect(page.getByText("Presente E2E Editado")).not.toBeVisible({
    timeout: 10_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-03-presente-removido.png` });
});

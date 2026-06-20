import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";

const DIR = "e2e/rsvp/evidencias";

test.beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
});

test("confirma presença via RSVP e exibe mensagem de confirmação", async ({ page }, testInfo) => {
  const proj = testInfo.project.name;

  // 1. Abre a lista de presentes do convidado
  await page.goto("/l/festa-rodrigo-25");

  // Aguarda o MSW inicializar e o conteúdo da lista carregar
  await expect(page.getByText("Meus 25 Anos!")).toBeVisible({
    timeout: 20_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-01-lista-aberta.png` });

  // 2. Clica no botão de RSVP visível (mobile: dentro do HostHeader, desktop: no header fixo)
  // Usa :visible para garantir apenas o botão renderizado para o viewport atual
  await page.locator("button:visible", { hasText: "Confirmar Presença (RSVP)" }).click();

  // 3. Aguarda o modal de RSVP abrir
  await expect(
    page.getByRole("heading", { name: "Confirmar Presença (RSVP)", level: 2 })
  ).toBeVisible({ timeout: 5_000 });

  await page.screenshot({ path: `${DIR}/${proj}-02-modal-rsvp.png` });

  // 4. Preenche o nome e confirma
  // Usa placeholder para distinguir do campo "Seu nome" do RecadoForm (visível no fundo)
  await page.getByPlaceholder("Digite seu nome").fill("Carlos Convidado");
  // exact:true evita conflito com o botão de trigger "Confirmar Presença (RSVP)" no fundo
  await page.getByRole("button", { name: "Confirmar Presença", exact: true }).click();

  // 5. Afirma mensagem de confirmação "Presença Confirmada!"
  await expect(page.getByText("Presença Confirmada!")).toBeVisible({
    timeout: 10_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-03-presenca-confirmada.png` });
});

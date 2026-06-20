import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";

const DIR = "e2e/reserva/evidencias";

test.beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
});

test("reserva um presente disponível, confirma sucesso e verifica bloqueio de segunda tentativa", async ({
  page,
}, testInfo) => {
  const proj = testInfo.project.name;

  // 1. Abre a lista de presentes do convidado
  await page.goto("/l/festa-rodrigo-25");

  // Aguarda o MSW inicializar e os presentes carregarem
  await expect(page.getByText("Câmera Instantânea")).toBeVisible({
    timeout: 20_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-01-lista-inicial.png` });

  // 2. Clica em "Presentear" na Câmera Instantânea (presente p2)
  const giftGrid = page.locator("div.grid").first();
  const cameraCard = giftGrid.locator("> div").filter({ hasText: "Câmera Instantânea" });

  await expect(cameraCard.getByRole("button", { name: "Presentear" })).toBeEnabled();
  await cameraCard.getByRole("button", { name: "Presentear" }).click();

  // 3. Aguarda a página de reserva carregar
  await page.waitForURL(/\/presentear\/p2/, { timeout: 10_000 });
  await expect(page.getByLabel("Seu nome")).toBeVisible({ timeout: 15_000 });

  // 4. Preenche o formulário de reserva
  await page.getByLabel("Seu nome").fill("Ana Teste");
  await page.getByLabel("Mensagem Carinhosa").fill("Parabéns, Rodrigo! Muitas felicidades!");

  // 5. Confirma a reserva
  await page.getByRole("button", { name: /Confirmar Reserva/ }).click();

  // 6. Confirma o overlay de sucesso "Presente Reservado!"
  await expect(page.getByText("Presente Reservado!")).toBeVisible({
    timeout: 15_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-02-presente-reservado.png` });

  // 7. Volta à lista
  await page.getByRole("button", { name: /Voltar à lista/ }).click();
  await page.waitForURL(/\/l\/festa-rodrigo-25$/, { timeout: 10_000 });

  // 8. Aguarda a lista recarregar com dados atualizados
  await expect(page.getByText("Câmera Instantânea")).toBeVisible({
    timeout: 15_000,
  });

  // 9. Afirma que o badge "Reservado" é visível no card da Câmera Instantânea
  const cameraCardUpdated = page
    .locator("div.grid")
    .first()
    .locator("> div")
    .filter({ hasText: "Câmera Instantânea" });

  await expect(cameraCardUpdated.getByText("Reservado")).toBeVisible({
    timeout: 10_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-03-gift-reservado.png` });

  // 10. Afirma que o botão "Presentear" está desabilitado (bloqueio de reserva duplicada)
  const presentearBtn = cameraCardUpdated.getByRole("button", {
    name: /Presentear/,
  });
  await expect(presentearBtn).toBeDisabled();

  await page.screenshot({
    path: `${DIR}/${proj}-04-botao-desabilitado.png`,
  });
});

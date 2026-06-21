import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";

const DIR = "e2e/reservation/evidence";

test.beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
});

test("reserves an available gift, confirms success, and verifies duplicate reservation is blocked", async ({
  page,
}, testInfo) => {
  const proj = testInfo.project.name;

  // 1. Open the guest gift list
  await page.goto("/l/festa-rodrigo-25");

  // Wait for MSW to initialize and gifts to load
  await expect(page.getByText("Câmera Instantânea")).toBeVisible({
    timeout: 20_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-01-initial-list.png` });

  // 2. Click "Presentear" on Câmera Instantânea (gift p2)
  const giftGrid = page.locator("div.grid").first();
  const cameraCard = giftGrid.locator("> div").filter({ hasText: "Câmera Instantânea" });

  await expect(cameraCard.getByRole("button", { name: "Presentear" })).toBeEnabled();
  await cameraCard.getByRole("button", { name: "Presentear" }).click();

  // 3. Wait for the reservation page to load
  await page.waitForURL(/\/gift\/p2/, { timeout: 10_000 });
  await expect(page.getByLabel("Seu nome")).toBeVisible({ timeout: 15_000 });

  // 4. Fill in the reservation form
  await page.getByLabel("Seu nome").fill("Ana Teste");
  await page.getByLabel("Mensagem Carinhosa").fill("Parabéns, Rodrigo! Muitas felicidades!");

  // 5. Confirm the reservation
  await page.getByRole("button", { name: /Confirmar Reserva/ }).click();

  // 6. Confirm the success overlay "Presente Reservado!"
  await expect(page.getByText("Presente Reservado!")).toBeVisible({
    timeout: 15_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-02-gift-reserved.png` });

  // 7. Return to the list
  await page.getByRole("button", { name: /Voltar à lista/ }).click();
  await page.waitForURL(/\/l\/festa-rodrigo-25$/, { timeout: 10_000 });

  // 8. Wait for the list to reload with updated data
  await expect(page.getByText("Câmera Instantânea")).toBeVisible({
    timeout: 15_000,
  });

  // 9. Assert that the "Reservado" badge is visible on the Câmera Instantânea card
  const cameraCardUpdated = page
    .locator("div.grid")
    .first()
    .locator("> div")
    .filter({ hasText: "Câmera Instantânea" });

  await expect(cameraCardUpdated.getByText("Reservado")).toBeVisible({
    timeout: 10_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-03-gift-reserved.png` });

  // 10. Assert that the "Presentear" button is disabled (duplicate reservation blocked)
  const giftButton = cameraCardUpdated.getByRole("button", {
    name: /Presentear/,
  });
  await expect(giftButton).toBeDisabled();

  await page.screenshot({
    path: `${DIR}/${proj}-04-disabled-button.png`,
  });
});

import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";

const DIR = "e2e/rsvp/evidence";

test.beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
});

test("confirms attendance via RSVP and displays confirmation message", async ({ page }, testInfo) => {
  const proj = testInfo.project.name;

  // 1. Open the guest gift list
  await page.goto("/l/festa-rodrigo-25");

  // Wait for MSW to initialize and list content to load
  await expect(page.getByText("Meus 25 Anos!")).toBeVisible({
    timeout: 20_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-01-list-open.png` });

  // 2. Click the visible RSVP button (mobile: inside HostHeader, desktop: in fixed header)
  // Uses :visible to target only the button rendered for the current viewport
  await page.locator("button:visible", { hasText: "Confirmar Presença (RSVP)" }).click();

  // 3. Wait for the RSVP modal to open
  await expect(
    page.getByRole("heading", { name: "Confirmar Presença (RSVP)", level: 2 })
  ).toBeVisible({ timeout: 5_000 });

  await page.screenshot({ path: `${DIR}/${proj}-02-rsvp-modal.png` });

  // 4. Fill in the name and confirm
  // Uses placeholder to distinguish from "Seu nome" in RecadoForm (visible in the background)
  await page.getByPlaceholder("Digite seu nome").fill("Carlos Convidado");
  // exact:true avoids conflict with the "Confirmar Presença (RSVP)" trigger button in the background
  await page.getByRole("button", { name: "Confirmar Presença", exact: true }).click();

  // 5. Assert confirmation message "Presença Confirmada!"
  await expect(page.getByText("Presença Confirmada!")).toBeVisible({
    timeout: 10_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-03-attendance-confirmed.png` });
});

import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";

const DIR = "e2e/guests/evidence";

const SESSION = {
  id: "host-1",
  name: "Rodrigo",
  email: "rodrigo@example.com",
  avatarUrl: "",
};

test.beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript((session) => {
    localStorage.setItem("bday.session", JSON.stringify(session));
  }, SESSION);
});

test("host adds a guest who shows up as pending", async ({ page }, testInfo) => {
  const proj = testInfo.project.name;

  await page.goto("/dashboard/guests");

  await expect(page.getByRole("heading", { name: "Convidados", level: 1 })).toBeVisible({
    timeout: 20_000,
  });

  // Seeded guest is visible and confirmed
  await expect(page.getByText("Carla Mendes")).toBeVisible({ timeout: 15_000 });

  await page.screenshot({ path: `${DIR}/${proj}-01-guest-list.png` });

  // Open the add-guest dialog
  await page.getByRole("button", { name: "Adicionar Convidado" }).click();
  await expect(
    page.getByRole("heading", { name: "Adicionar Convidado", level: 2 })
  ).toBeVisible({ timeout: 5_000 });

  await page.getByLabel("Nome do Convidado").fill("Fernanda Alves");
  await page.getByLabel("E-mail").fill("fernanda@example.com");
  await page.getByRole("button", { name: "Adicionar", exact: true }).click();

  // New guest appears and is pending (not yet confirmed)
  await expect(page.getByText("Fernanda Alves")).toBeVisible({ timeout: 10_000 });
  const newCard = page.locator("li", { hasText: "Fernanda Alves" });
  await expect(newCard.getByText("Pendente")).toBeVisible();

  await page.screenshot({ path: `${DIR}/${proj}-02-guest-added.png` });
});

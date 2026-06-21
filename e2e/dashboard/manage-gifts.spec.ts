import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";

const DIR = "e2e/dashboard/evidence";

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
  // Inject authenticated session before any page script runs
  await page.addInitScript((session) => {
    localStorage.setItem("bday.session", JSON.stringify(session));
  }, SESSION);
});

test("adds, edits, and removes a gift in the host dashboard", async ({
  page,
}, testInfo) => {
  const proj = testInfo.project.name;

  // 1. Navigate to the dashboard already authenticated
  await page.goto("/dashboard");

  // Wait for MSW to initialize and the dashboard to load with the greeting
  await expect(page.getByText(/Olá, Rodrigo/)).toBeVisible({
    timeout: 20_000,
  });

  // Wait for seed gifts to appear (confirms GET /api/dashboard loaded)
  await expect(page.getByText("Fone Bluetooth Premium")).toBeVisible({
    timeout: 15_000,
  });

  // 2. Click the "Adicionar Novo" tile in the grid (always visible on mobile and desktop)
  await page.getByRole("button", { name: "Adicionar Novo", exact: true }).click();

  // Wait for the "Adicionar Presente" form to open
  await expect(page.getByRole("heading", { name: "Adicionar Presente", level: 2 })).toBeVisible({
    timeout: 5_000,
  });

  // 3. Fill in the name of the new gift
  await page.getByLabel("Nome do Presente").fill("Presente E2E Test");

  // Submit the form
  await page.getByRole("button", { name: "Salvar" }).click();

  // 4. Assert that the new gift appears in the grid
  await expect(page.getByText("Presente E2E Test")).toBeVisible({
    timeout: 10_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-01-gift-added.png` });

  // 5. Edit the newly added gift
  await page.getByLabel("Editar Presente E2E Test").click();

  // Wait for the edit form to open
  await expect(page.getByRole("heading", { name: "Editar Presente", level: 2 })).toBeVisible({
    timeout: 5_000,
  });

  // Change the name
  const nameInput = page.getByLabel("Nome do Presente");
  await nameInput.clear();
  await nameInput.fill("Presente E2E Editado");
  await page.getByRole("button", { name: "Salvar" }).click();

  // 6. Assert that the updated name appears in the grid
  await expect(page.getByText("Presente E2E Editado")).toBeVisible({
    timeout: 10_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-02-gift-edited.png` });

  // 7. Remove the edited gift
  await page.getByLabel("Remover Presente E2E Editado").click();

  // 8. Assert that the gift is gone from the grid
  await expect(page.getByText("Presente E2E Editado")).not.toBeVisible({
    timeout: 10_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-03-gift-removed.png` });
});

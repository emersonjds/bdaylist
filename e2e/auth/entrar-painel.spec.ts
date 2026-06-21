import { test, expect } from "@playwright/test";

test("clicar em Entrar leva ao painel logado", async ({ page }, testInfo) => {
  await page.goto("/");
  // On mobile the desktop "Entrar" button is hidden; the hamburger triggers sign-in instead.
  const isMobile = testInfo.project.name.includes("mobile");
  const entrar = isMobile
    ? page.getByRole("button", { name: "Abrir menu" })
    : page.getByRole("button", { name: "Entrar" }).first();
  await entrar.click();
  await page.waitForURL("**/dashboard");
  await expect(page.getByText(/Olá,/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Meus Presentes" })).toBeVisible();
  await page.screenshot({
    path: `e2e/auth/evidencias/entrar-painel-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

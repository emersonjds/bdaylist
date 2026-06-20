import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";

test.beforeAll(() => {
  mkdirSync("e2e/lista/evidencias", { recursive: true });
});

test("lista do convidado mostra hero, filtros e presentes", async ({ page }, testInfo) => {
  await page.goto("/l/festa-rodrigo-25");
  await expect(page.getByRole("heading", { name: /Meus 25 Anos/ })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole("button", { name: /Presentear/ }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Contribuir/ })).toBeVisible();
  await page.screenshot({
    path: `e2e/lista/evidencias/lista-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";

const DIR = "e2e/auth/evidence";

test.beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
});

test("shows login CTA when accessing /dashboard without a session and signs in with Google", async ({
  page,
}, testInfo) => {
  const proj = testInfo.project.name;

  // 1. Visit /dashboard without an authenticated session
  await page.goto("/dashboard");

  // Wait for MSW to initialize and the LoginCTA to appear
  await expect(page.getByRole("button", { name: "Entrar com Google" })).toBeVisible({
    timeout: 20_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-01-login-cta.png` });

  // 2. Click "Entrar com Google"
  await page.getByRole("button", { name: "Entrar com Google" }).click();

  // 3. Wait for the dashboard to load after mocked authentication
  // POST /api/auth/google is intercepted by MSW and returns user Rodrigo
  await expect(page.getByText(/Olá, Rodrigo/)).toBeVisible({
    timeout: 20_000,
  });

  await page.screenshot({ path: `${DIR}/${proj}-02-dashboard-authenticated.png` });
});

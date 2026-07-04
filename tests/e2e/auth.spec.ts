import { test, expect } from "@playwright/test";

const EMAIL = "admin@theguidinglight.com";
const PASSWORD = "Admin123!";

test.beforeEach(async ({ page }) => {
  await page.goto("/en/auth/login");
});

test("login as admin redirects to /en/admin", async ({ page }) => {
  await page.getByTestId("login-email").fill(EMAIL);
  await page.getByTestId("login-password").fill(PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/admin/);
  expect(page.url()).toContain("/en/admin");
});

test("login shows error on invalid credentials", async ({ page }) => {
  await page.getByTestId("login-email").fill("wrong@test.com");
  await page.getByTestId("login-password").fill("badpass");
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("login-error")).toBeVisible();
});

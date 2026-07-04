import { test, expect } from "@playwright/test";

const EMAIL = "student@theguidinglight.com";
const PASSWORD = "Student123!";

test.beforeEach(async ({ page }) => {
  await page.goto("/en/auth/login");
  await page.getByTestId("login-email").fill(EMAIL);
  await page.getByTestId("login-password").fill(PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/dashboard/);
});

test("student navigating to /admin is redirected to /dashboard", async ({ page }) => {
  await page.goto("/en/admin");
  await page.waitForURL(/\/en\/dashboard/);
  expect(page.url()).toContain("/en/dashboard");
});

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

test("join page shows error for invalid invite code", async ({ page }) => {
  await page.goto("/en/join/INVALIDCODE");
  await expect(page.getByTestId("join-error")).toBeVisible();
});

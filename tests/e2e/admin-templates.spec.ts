import { test, expect } from "@playwright/test";

const EMAIL = "admin@theguidinglight.com";
const PASSWORD = "Admin123!";

test.beforeEach(async ({ page }) => {
  await page.goto("/en/auth/login");
  await page.evaluate(() => localStorage.setItem("tour_completed", "true"));
  await page.getByTestId("login-email").fill(EMAIL);
  await page.getByTestId("login-password").fill(PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/(dashboard|admin)/);
  await page.waitForLoadState("networkidle");
  if (page.url().includes("/en/dashboard")) {
    await page.goto("/en/admin");
    await page.waitForLoadState("networkidle");
  }
});

test("admin can create a template", async ({ page }) => {
  const ts = Date.now();
  await page.getByTestId("nav-templates").click();
  await page.waitForURL(/\/en\/admin\/templates/);

  await page.getByTestId("new-template").click();
  await page.getByTestId("template-form-name").fill(`E2E Template ${ts}`);
  await page.getByTestId("template-form-desc").fill("Created by E2E test");

  // Fill content in the markdown editor (required field)
  await page.locator(".w-md-editor-text-input").fill("## Test content for E2E template");

  await page.getByTestId("template-form-save").click();

  // Wait for the template name text to appear in the list (proves save + reload succeeded)
  await expect(page.getByText(`E2E Template ${ts}`)).toBeVisible({ timeout: 10000 });

  // Verify the template item has a data-testid
  await expect(page.getByTestId(/template-item-.+/).first()).toBeVisible();
});

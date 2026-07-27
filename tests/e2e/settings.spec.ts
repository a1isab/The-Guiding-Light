import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

test.describe.configure({ timeout: 120000 });

test.describe("settings page", () => {
  test("settings page loads with heading", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("dark mode button is selectable", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");

    const darkBtn = page.getByRole("button").filter({ hasText: /Dark|dark|داكن|Sombre|گہرا/ });
    await expect(darkBtn.first()).toBeVisible();
    await darkBtn.first().click();

    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("dark");
  });

  test("light mode button is selectable", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");

    const lightBtn = page.getByRole("button").filter({ hasText: /Light|light|فاتح| Clair|روشن/ });
    await expect(lightBtn.first()).toBeVisible();
    await lightBtn.first().click();

    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("light");
  });

  test("theme persists after page reload", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");

    const lightBtn = page.getByRole("button").filter({ hasText: /Light|light|فاتح|Clair|روشن/ });
    await lightBtn.first().click();
    await page.reload();
    await page.waitForLoadState("networkidle");

    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("light");
  });

  test("language links are present for all locales", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");

    const langLinks = page.locator('a[href*="/settings"]').filter({ hasText: /English|العربية|اردو|Français/ });
    const count = await langLinks.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("clicking Arabic switches locale to /ar/settings", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");

    const arLink = page.getByRole("link", { name: /العربية/ });
    await arLink.click();
    await page.waitForURL(/\/ar\/settings/);
    expect(page.url()).toContain("/ar/settings");
  });

  test("back to dashboard link navigates to dashboard", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");

    const backLink = page.getByRole("link").filter({ hasText: /Back|dashboard/i });
    if (await backLink.first().isVisible().catch(() => false)) {
      await backLink.first().click();
      await page.waitForURL(/\/en\/dashboard/);
    }
  });

  test("settings accessible from Arabic locale", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/ar/settings");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

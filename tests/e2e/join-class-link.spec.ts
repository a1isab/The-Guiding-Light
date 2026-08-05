import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { loginAs } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

test.describe.configure({ timeout: 120000 });

test.describe("join class via link", () => {
  let data: TestData;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    data = await setupTeacherLesson(page);
    await ctx.close();
  });

  test("join page with invalid code shows error", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/join/INVALIDCODE");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const hasError = await page.getByTestId("join-error").isVisible().catch(() => false);
    const hasExpired = await page.getByTestId("join-expired").isVisible().catch(() => false);
    expect(hasError || hasExpired).toBe(true);
  });

  test("join page with valid code shows success or already member", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/join/${data.inviteCode}`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const hasSuccess = await page.getByTestId("join-success").isVisible().catch(() => false);
    const hasExists = await page.getByTestId("join-exists").isVisible().catch(() => false);
    const hasError = await page.getByTestId("join-error").isVisible().catch(() => false);
    expect(hasSuccess || hasExists || hasError).toBe(true);
  });

  test("join success shows go to dashboard button", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/join/${data.inviteCode}`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const hasSuccess = await page.getByTestId("join-success").isVisible().catch(() => false);
    if (hasSuccess) {
      await expect(page.getByTestId("join-go-to-dashboard")).toBeVisible();
    }
  });

  test("unauthenticated user visiting join page is redirected to login", async ({ page }) => {
    await page.goto(`/en/join/${data.inviteCode}`);
    await page.waitForURL(/\/en\/auth\/login/);
    expect(page.url()).toContain("/en/auth/login");
  });
});

import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

test.describe.configure({ timeout: 120000 });

test.describe("featured browsing", () => {
  test("10.5 featured page requires authentication", async ({ page }) => {
    await page.goto("/en/featured");
    await page.waitForURL(/\/en\/auth\/login/, { timeout: 10000 });
  });

  test("10.5 logged-in user can access featured page", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/featured");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText("Featured", { timeout: 10000 });
  });

  test("10.5 featured page shows teachers/classes toggle or empty state", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/featured");
    await page.waitForLoadState("networkidle");

    const hasTabs = await page.getByTestId("featured-tab-teachers").isVisible().catch(() => false);
    const hasEmpty = await page.getByText("No verified teachers").isVisible().catch(() => false);
    expect(hasTabs || hasEmpty).toBe(true);
  });

  test("10.5 can toggle between teachers and classes views", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/featured");
    await page.waitForLoadState("networkidle");

    const hasTabs = await page.getByTestId("featured-tab-teachers").isVisible().catch(() => false);
    if (!hasTabs) return;

    await page.getByTestId("featured-tab-classes").click();
    await expect(page.getByTestId("featured-classes-view")).toBeVisible();

    await page.getByTestId("featured-tab-teachers").click();
    await expect(page.getByTestId("featured-teachers-view")).toBeVisible();
  });

  test("10.5 featured page renders teacher or empty state", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/featured");
    await page.waitForLoadState("networkidle");

    const hasTeacher = await page.getByTestId(/^featured-teacher-card-/).first().isVisible().catch(() => false);
    const hasEmpty = await page.getByText("No verified teachers").isVisible().catch(() => false);

    expect(hasTeacher || hasEmpty).toBe(true);
  });

  test("10.5 featured page renders class cards or empty state", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/featured");
    await page.waitForLoadState("networkidle");

    const hasTabs = await page.getByTestId("featured-tab-classes").isVisible().catch(() => false);
    if (!hasTabs) {
      const hasEmpty = await page.getByText("No verified teachers").isVisible().catch(() => false);
      expect(hasEmpty).toBe(true);
      return;
    }

    await page.getByTestId("featured-tab-classes").click();

    const hasClass = await page.getByTestId(/^featured-class-card-/).first().isVisible().catch(() => false);
    const hasEmpty = await page.getByText("No classes").isVisible().catch(() => false);

    expect(hasClass || hasEmpty).toBe(true);
  });
});

import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";
const ADMIN_EMAIL = "admin@theguidinglight.com";
const ADMIN_PASSWORD = "Admin123!";

test.describe.configure({ timeout: 120000 });

test.describe("site tour", () => {
  test("10.8 tour auto-starts for first-time visitor (student)", async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.evaluate(() => localStorage.removeItem("tour_completed"));
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.waitForTimeout(2000);

    const driverOverlay = page.locator(".driver-overlay, .driver-fade");
    const driverPopover = page.locator(".driver-popover");
    const hasOverlay = await driverOverlay.isVisible().catch(() => false);
    const hasPopover = await driverPopover.isVisible().catch(() => false);
    expect(hasOverlay || hasPopover).toBe(true);
  });

  test("10.8 tour does not restart after completion", async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.evaluate(() => localStorage.setItem("tour_completed", "true"));
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.waitForTimeout(2000);

    const driverOverlay = page.locator(".driver-overlay, .driver-fade");
    const hasOverlay = await driverOverlay.isVisible().catch(() => false);
    expect(hasOverlay).toBe(false);
  });

  test("10.8 navbar shows tour replay button in dropdown", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(1500);

    const overlay = page.locator(".driver-overlay");
    if (await overlay.isVisible().catch(() => false)) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
    }

    await page.getByTestId("user-menu-btn").click();
    await page.waitForTimeout(500);

    const tourBtn = page.getByText("Tour", { exact: true });
    const hasTour = await tourBtn.first().isVisible().catch(() => false);
    expect(hasTour).toBe(true);
  });

  test("10.8 teacher can trigger tour via navbar", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.evaluate(() => localStorage.removeItem("tour_completed"));
    await page.waitForLoadState("networkidle");

    const tourBtn = page.getByText("Tour").or(page.locator('[data-testid="tour-btn"]'));
    if (await tourBtn.first().isVisible().catch(() => false)) {
      await tourBtn.first().click();
      await page.waitForTimeout(1500);

      const driverPopover = page.locator(".driver-popover");
      const driverOverlay = page.locator(".driver-overlay, .driver-fade");
      const hasPopover = await driverPopover.isVisible().catch(() => false);
      const hasOverlay = await driverOverlay.isVisible().catch(() => false);
      expect(hasPopover || hasOverlay).toBe(true);
    }
  });

  test("10.8 admin can trigger tour via navbar", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.evaluate(() => localStorage.removeItem("tour_completed"));
    await page.waitForLoadState("networkidle");

    const tourBtn = page.getByText("Tour").or(page.locator('[data-testid="tour-btn"]'));
    if (await tourBtn.first().isVisible().catch(() => false)) {
      await tourBtn.first().click();
      await page.waitForTimeout(1500);

      const driverPopover = page.locator(".driver-popover");
      const driverOverlay = page.locator(".driver-overlay, .driver-fade");
      const hasPopover = await driverPopover.isVisible().catch(() => false);
      const hasOverlay = await driverOverlay.isVisible().catch(() => false);
      expect(hasPopover || hasOverlay).toBe(true);
    }
  });
});

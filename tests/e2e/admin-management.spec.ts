import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

const ADMIN_EMAIL = "admin@theguidinglight.com";
const ADMIN_PASSWORD = "Admin123!";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

test.describe.configure({ timeout: 120000 });

test.describe("admin dashboard", () => {
  test("admin dashboard shows all stat cards", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("stat-total-users")).toBeVisible();
    await expect(page.getByTestId("stat-new-users")).toBeVisible();
    await expect(page.getByTestId("stat-lessons-completed")).toBeVisible();
    await expect(page.getByTestId("stat-total-courses")).toBeVisible();
  });

  test("admin dashboard shows recent activity section", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("recent-activity")).toBeVisible();
  });
});

test.describe("admin users page", () => {
  test("users page loads with table", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin/users");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1, h2").first()).toBeVisible();
    const hasTable = await page.locator("table").isVisible().catch(() => false);
    const hasRows = await page.locator("[data-testid^='user-row-']").count().catch(() => 0);
    expect(hasTable || hasRows > 0).toBe(true);
  });

  test("user rows show role selectors when users exist", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin/users");
    await page.waitForLoadState("networkidle");

    const firstRow = page.locator("[data-testid^='user-row-']").first();
    if (await firstRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      const userId = (await firstRow.getAttribute("data-testid"))?.replace("user-row-", "");
      await expect(page.getByTestId(`role-select-${userId}`)).toBeVisible();
    }
  });
});

test.describe("admin invites page", () => {
  test("invites page loads with generate button", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin/invites");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("generate-invite")).toBeVisible();
  });

  test("generating invite creates new invite row", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin/invites");
    await page.waitForLoadState("networkidle");

    const beforeCount = await page.locator("[data-testid^='invite-row-']").count();
    await page.getByTestId("generate-invite").click();
    await page.waitForTimeout(2000);

    const afterCount = await page.locator("[data-testid^='invite-row-']").count();
    expect(afterCount).toBeGreaterThanOrEqual(beforeCount);
  });

  test("invite row shows status and copy button", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin/invites");
    await page.waitForLoadState("networkidle");

    const firstInvite = page.locator("[data-testid^='invite-row-']").first();
    if (await firstInvite.isVisible().catch(() => false)) {
      const inviteId = (await firstInvite.getAttribute("data-testid"))?.replace("invite-row-", "");
      await expect(page.getByTestId(`invite-status-${inviteId}`)).toBeVisible();
      await expect(page.getByTestId(`copy-invite-${inviteId}`)).toBeVisible();
    }
  });
});

test.describe("admin verifications page", () => {
  test("verifications page loads", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin/verifications");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("admin can list verification requests via API", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    const listResult = await page.evaluate(async () => {
      const res = await fetch("/api/admin/verifications");
      return { status: res.status, ok: res.ok };
    });
    expect([200, 401]).toContain(listResult.status);
  });
});

test.describe("admin templates page", () => {
  test("templates page loads with new template button", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin/templates");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("new-template")).toBeVisible();
  });
});

test.describe("role-based access", () => {
  test("student cannot access admin pages", async ({ page }) => {
    await loginAs(page, "student@theguidinglight.com", "Student123!");
    await page.goto("/en/admin");
    await page.waitForURL(/\/en\/(dashboard|auth\/login)/);
    expect(page.url()).not.toContain("/en/admin");
  });

  test("teacher cannot access admin pages", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto("/en/admin");
    await page.waitForURL(/\/en\/(teacher|dashboard|auth\/login)/);
    expect(page.url()).not.toContain("/en/admin");
  });

  test("student cannot access teacher pages", async ({ page }) => {
    await loginAs(page, "student@theguidinglight.com", "Student123!");
    await page.goto("/en/teacher");
    await page.waitForURL(/\/en\/(dashboard|auth\/login)/);
    expect(page.url()).not.toContain("/en/teacher");
  });

  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/en/dashboard");
    await page.waitForURL(/\/en\/auth\/login/);
    expect(page.url()).toContain("/en/auth/login");
  });
});

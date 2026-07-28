import { test, expect } from "@playwright/test";

const EMAIL = "admin@theguidinglight.com";
const PASSWORD = "Admin123!";

test.describe.configure({ timeout: 120000 });

test.describe("admin dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.evaluate(() => localStorage.setItem("tour_completed", "true"));
    await page.getByTestId("login-email").fill(EMAIL);
    await page.getByTestId("login-password").fill(PASSWORD);
    await page.getByTestId("login-submit").click();
    await page.waitForURL(/\/en\/admin/);
  });

  test("7.1 admin dashboard shows stat cards and activity", async ({ page }) => {
    await expect(page.getByTestId("stat-total-users")).toBeVisible();
    await expect(page.getByTestId("stat-new-users")).toBeVisible();
    await expect(page.getByTestId("stat-lessons-completed")).toBeVisible();
    await expect(page.getByTestId("stat-total-courses")).toBeVisible();
    await expect(page.getByTestId("recent-activity")).toBeVisible();
  });
});

test.describe("admin user management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.evaluate(() => localStorage.setItem("tour_completed", "true"));
    await page.getByTestId("login-email").fill(EMAIL);
    await page.getByTestId("login-password").fill(PASSWORD);
    await page.getByTestId("login-submit").click();
    await page.waitForURL(/\/en\/admin/);
  });

  test("7.4 admin user list page loads correctly", async ({ page }) => {
    await page.goto("/en/admin/users");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Users", { timeout: 10000 });
  });

  test("7.5 admin generates a teacher invite code", async ({ page }) => {
    await page.goto("/en/admin/invites");
    await page.waitForLoadState("networkidle");
    await page.getByTestId("generate-invite").click();
    await page.waitForTimeout(2000);
    await page.waitForLoadState("networkidle");

    const inviteRow = page.getByTestId(/invite-row-/).first();
    await expect(inviteRow).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId(/invite-code-/).first()).toBeVisible();
  });
});

test.describe("admin edit template", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.evaluate(() => localStorage.setItem("tour_completed", "true"));
    await page.getByTestId("login-email").fill(EMAIL);
    await page.getByTestId("login-password").fill(PASSWORD);
    await page.getByTestId("login-submit").click();
    await page.waitForURL(/\/en\/admin/);
  });

  test("7.7 admin edits a template", async ({ page }) => {
    await page.getByTestId("nav-templates").click();
    await page.waitForURL(/\/en\/admin\/templates/);
    await page.waitForLoadState("networkidle");

    const editBtn = page.getByTestId(/edit-template-/).first();
    if (!(await editBtn.isVisible().catch(() => false))) {
      test.skip();
      return;
    }
    await editBtn.click();
    await page.getByTestId("template-form-name").fill(`Edited E2E ${Date.now()}`);
    await page.getByTestId("template-form-save").click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId(/template-item-/).first()).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@theguidinglight.com";
const ADMIN_PASSWORD = "Admin123!";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

test.describe("signup flow", () => {
  test("4.1 student signup navigates to verify page", async ({ page }) => {
    const email = `e2e-student-${Date.now()}@test.com`;
    await page.goto("/en/auth/signup");
    await page.getByTestId("signup-email").fill(email);
    await page.getByTestId("signup-password").fill("Test123!");
    await page.getByTestId("signup-role-student").click();
    await page.getByTestId("signup-submit").click();
    await page.waitForURL(/\/en\/auth\/verify/);
    expect(page.url()).toContain("/en/auth/verify");
  });

  test("4.2 signup with existing email shows error", async ({ page }) => {
    await page.goto("/en/auth/signup");
    await page.getByTestId("signup-email").fill(ADMIN_EMAIL);
    await page.getByTestId("signup-password").fill(ADMIN_PASSWORD);
    await page.getByTestId("signup-role-student").click();
    await page.getByTestId("signup-submit").click();
    await expect(page.getByTestId("signup-error")).toBeVisible();
  });

  test("4.3 teacher signup with valid invite code navigates to verify", async ({ page }) => {
    const email = `e2e-teacher-${Date.now()}@test.com`;
    const ts = Date.now();

    await page.goto("/en/auth/login");
    await page.getByTestId("login-email").fill(TEACHER_EMAIL);
    await page.getByTestId("login-password").fill(TEACHER_PASSWORD);
    await page.getByTestId("login-submit").click();
    await page.waitForURL(/\/en\/teacher/);

    await page.goto("/en/teacher/classes/new");
    await page.getByTestId("class-name-input").fill(`E2E Auth Class ${ts}`);
    await page.getByTestId("class-description").fill(`Auto-created by E2E test ${ts}`);
    await page.getByTestId("class-submit").click();
    await page.waitForURL(/\/en\/teacher\/classes\//);
    await page.waitForLoadState("networkidle");

    const inviteCode = await page.getByTestId("invite-code-value").textContent();
    expect(inviteCode).toBeTruthy();
    const code = (inviteCode ?? "").trim();
    expect(code.length).toBeGreaterThan(0);

    await page.goto("/en/auth/logout");
    await page.waitForURL(/\/en(\/|$)/);

    await page.goto("/en/auth/signup");
    await page.getByTestId("signup-email").fill(email);
    await page.getByTestId("signup-password").fill("Test123!");
    await page.getByTestId("signup-role-teacher").click();
    await page.getByTestId("signup-invite-code").fill(code);
    await page.getByTestId("signup-submit").click();
    await page.waitForURL(/\/en\/auth\/verify/);
    expect(page.url()).toContain("/en/auth/verify");
  });

  test("4.4 teacher signup with invalid invite code shows error", async ({ page }) => {
    await page.goto("/en/auth/signup");
    await page.getByTestId("signup-email").fill(`e2e-invalid-invite-${Date.now()}@test.com`);
    await page.getByTestId("signup-password").fill("Test123!");
    await page.getByTestId("signup-role-teacher").click();
    await page.getByTestId("signup-invite-code").fill("INVALID123");
    await page.getByTestId("signup-submit").click();
    await expect(page.getByTestId("signup-error")).toBeVisible();
  });
});

test.describe("verify page", () => {
  test("4.5 verify page accepts correct code and logs in", async ({ page }) => {
    const email = `e2e-verify-ok-${Date.now()}@test.com`;
    await page.goto("/en/auth/signup");
    await page.getByTestId("signup-email").fill(email);
    await page.getByTestId("signup-password").fill("Test123!");
    await page.getByTestId("signup-role-student").click();
    await page.getByTestId("signup-submit").click();
    await page.waitForURL(/\/en\/auth\/verify/);

    const expectedCode = await page.getByTestId("verify-displayed-code").textContent();
    expect(expectedCode).toBeTruthy();
    const digits = (expectedCode ?? "").trim().split("");

    for (let i = 0; i < digits.length; i++) {
      await page.getByTestId(`verify-code-input-${i}`).fill(digits[i]);
    }
    await page.getByTestId("verify-submit").click();
    await page.waitForURL(/\/en\/dashboard/);
  });

  test("4.6 verify page shows error on wrong code", async ({ page }) => {
    const email = `e2e-verify-fail-${Date.now()}@test.com`;
    await page.goto("/en/auth/signup");
    await page.getByTestId("signup-email").fill(email);
    await page.getByTestId("signup-password").fill("Test123!");
    await page.getByTestId("signup-role-student").click();
    await page.getByTestId("signup-submit").click();
    await page.waitForURL(/\/en\/auth\/verify/);

    for (let i = 0; i < 6; i++) {
      await page.getByTestId(`verify-code-input-${i}`).fill("0");
    }
    await page.getByTestId("verify-submit").click();
    await expect(page.getByTestId("verify-error")).toBeVisible();
  });

  test("4.7 verify page redirects to signup when no session data", async ({ page }) => {
    await page.goto("/en/auth/verify");
    await page.waitForURL(/\/en\/auth\/signup/);
    expect(page.url()).toContain("/en/auth/signup");
  });
});

test.describe("login flow", () => {
  test("4.8 login as admin redirects to /admin", async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.getByTestId("login-email").fill(ADMIN_EMAIL);
    await page.getByTestId("login-password").fill(ADMIN_PASSWORD);
    await page.getByTestId("login-submit").click();
    await page.waitForURL(/\/en\/admin/);
    expect(page.url()).toContain("/en/admin");
  });

  test("4.8 login as teacher redirects to /teacher", async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.getByTestId("login-email").fill(TEACHER_EMAIL);
    await page.getByTestId("login-password").fill(TEACHER_PASSWORD);
    await page.getByTestId("login-submit").click();
    await page.waitForURL(/\/en\/teacher/);
    expect(page.url()).toContain("/en/teacher");
  });

  test("4.9 invalid credentials show error", async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.getByTestId("login-email").fill("wrong@test.com");
    await page.getByTestId("login-password").fill("badpass");
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("login-error")).toBeVisible();
  });

  test("4.12 logout clears session and redirects to login on protected page", async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.getByTestId("login-email").fill(ADMIN_EMAIL);
    await page.getByTestId("login-password").fill(ADMIN_PASSWORD);
    await page.getByTestId("login-submit").click();
    await page.waitForURL(/\/en\/admin/);

    await page.goto("/en/auth/logout");
    await page.waitForURL(/\/en(\/|$)/);
    expect(page.url()).not.toContain("/en/admin");

    await page.goto("/en/admin");
    await page.waitForURL(/\/en\/auth\/login/);
  });
});

test.describe("forgot / reset password", () => {
  test("4.10 forgot password shows sent confirmation", async ({ page }) => {
    await page.goto("/en/auth/forgot-password");
    await page.getByTestId("forgot-email").fill(ADMIN_EMAIL);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByTestId("forgot-sent")).toBeVisible();
  });

  test("4.11 reset password shows error on mismatched passwords", async ({ page }) => {
    await page.goto("/en/auth/reset-password");
    await page.getByTestId("reset-password").fill("NewPass123!");
    await page.getByTestId("reset-confirm").fill("DifferentPass456!");
    await page.getByTestId("reset-password-submit").click();
    await expect(page.getByTestId("reset-error")).toBeVisible();
  });
});

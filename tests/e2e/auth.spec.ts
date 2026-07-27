import { test, expect } from "@playwright/test";
import { loginAs, setOnboarded, loginAsForOnboarding } from "./helpers/auth";

const ADMIN_EMAIL = "admin@theguidinglight.com";
const ADMIN_PASSWORD = "Admin123!";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

test.describe("login redirect", () => {
  test("4.1 unauthenticated user visiting dashboard is redirected to login", async ({ page }) => {
    await page.goto("/en/dashboard");
    await page.waitForURL(/\/en\/auth\/login/);
    expect(page.url()).toContain("/en/auth/login");
  });

  test("4.1 student login redirects to /dashboard", async ({ page }) => {
    await loginAs(page, "student@theguidinglight.com", "Student123!");
    await page.waitForURL(/\/en\/dashboard/);
    expect(page.url()).toContain("/en/dashboard");
  });
});

test.describe("login flow", () => {
  test("4.2 login as admin redirects to /admin", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/en\/admin/);
    expect(page.url()).toContain("/en/admin");
  });

  test("4.2 login as teacher redirects to /teacher", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.waitForURL(/\/en\/teacher/);
    expect(page.url()).toContain("/en/teacher");
  });

  test("4.3 invalid credentials show error", async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.getByTestId("login-email").fill("wrong@test.com");
    await page.getByTestId("login-password").fill("badpass");
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("login-error")).toBeVisible();
  });

  test("4.4 logout clears session and redirects to login on protected page", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/en\/admin/);

    await page.goto("/en/auth/logout", { waitUntil: "commit" });
    await page.waitForURL(/\/en(\/|$)/);
    expect(page.url()).not.toContain("/en/admin");

    await page.goto("/en/admin");
    await page.waitForURL(/\/en\/auth\/login/);
  });
});

test.describe("forgot / reset password", () => {
  test("4.5 reset password shows error on mismatched passwords", async ({ page }) => {
    await page.goto("/en/auth/reset-password");
    await page.getByTestId("reset-password").fill("NewPass123!");
    await page.getByTestId("reset-confirm").fill("DifferentPass456!");
    await page.getByTestId("reset-password-submit").click();
    await expect(page.getByTestId("reset-error")).toBeVisible();
  });
});

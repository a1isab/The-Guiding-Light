import { test, expect } from "@playwright/test";
import { loginAsForOnboarding, setOnboarded, loginAs } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";
const TEACHER_PASSWORD = "Teacher123!";

test.describe.configure({ timeout: 120000 });

test.describe("onboarding wizard for student", () => {
  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, true);
    await ctx.close();
  });

  test("10.1 student sees onboarding wizard when not onboarded", async ({ page }) => {
    await loginAsForOnboarding(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("onboarding-wizard")).toBeVisible();
    await expect(page.getByTestId("onboarding-step-0")).toBeVisible();

    await setOnboarded(page, true);
  });

  test("10.2 wizard shows step indicator with correct step count", async ({ page }) => {
    await loginAsForOnboarding(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("onboarding-wizard")).toBeVisible();
    await expect(page.getByText("1 / 5")).toBeVisible();

    await setOnboarded(page, true);
  });

  test("10.3 student can click Next through all steps", async ({ page }) => {
    await loginAsForOnboarding(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    const wizard = page.getByTestId("onboarding-wizard");
    await expect(page.getByTestId("onboarding-step-0")).toBeVisible();
    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-1")).toBeVisible();

    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-2")).toBeVisible();

    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-3")).toBeVisible();

    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-4")).toBeVisible();

    await setOnboarded(page, true);
  });

  test("10.4 student can go back with Previous button", async ({ page }) => {
    await loginAsForOnboarding(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    const wizard = page.getByTestId("onboarding-wizard");
    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-1")).toBeVisible();

    await wizard.getByRole("button", { name: "Previous" }).click();
    await expect(page.getByTestId("onboarding-step-0")).toBeVisible();

    await setOnboarded(page, true);
  });

  test("10.5 student can enter display name on step 1", async ({ page }) => {
    await loginAsForOnboarding(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    const wizard = page.getByTestId("onboarding-wizard");
    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-1")).toBeVisible();

    const nameInput = page.locator('input[placeholder="Your display name"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Test Student");

    await setOnboarded(page, true);
  });

  test("10.6 skip button navigates away from onboarding", async ({ page }) => {
    await loginAsForOnboarding(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("onboarding-wizard")).toBeVisible();

    await page.getByText("Skip for now").click();
    await page.waitForURL(/\/en\/dashboard/);

    await setOnboarded(page, true);
  });

  test("10.7 complete button is disabled without display name", async ({ page }) => {
    await loginAsForOnboarding(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    const wizard = page.getByTestId("onboarding-wizard");
    for (let i = 0; i < 4; i++) {
      await wizard.getByRole("button", { name: "Next" }).click();
    }
    await expect(page.getByTestId("onboarding-step-4")).toBeVisible();

    const completeBtn = wizard.getByRole("button", { name: "Complete" });
    await expect(completeBtn).toBeDisabled();

    await setOnboarded(page, true);
  });
});

test.describe("onboarding wizard for teacher", () => {
  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await setOnboarded(page, true);
    await ctx.close();
  });

  test("10.8 teacher sees onboarding wizard with 4 steps", async ({ page }) => {
    await loginAsForOnboarding(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("onboarding-wizard")).toBeVisible();
    await expect(page.getByText("1 / 4")).toBeVisible();

    await setOnboarded(page, true);
  });

  test("10.9 teacher can navigate through all steps", async ({ page }) => {
    await loginAsForOnboarding(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    const wizard = page.getByTestId("onboarding-wizard");
    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-1")).toBeVisible();

    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-2")).toBeVisible();

    await wizard.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-3")).toBeVisible();

    await setOnboarded(page, true);
  });
});

test.describe("onboarding redirect behavior", () => {
  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, true);
    await ctx.close();
  });

  test("10.10 already onboarded student is redirected from /onboarding to dashboard", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/en\/dashboard/);
  });

  test("10.11 non-onboarded student is redirected from dashboard to onboarding", async ({ page }) => {
    await loginAsForOnboarding(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForURL(/\/en\/onboarding/, { timeout: 15000 });

    await setOnboarded(page, true);
  });

  test("10.12 onboarding API requires display name", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);

    const result = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: "" }),
      });
      return { status: res.status, body: await res.json() };
    });
    expect(result.status).toBe(400);
  });

  test("10.13 onboarding API succeeds with display name", async ({ page }) => {
    await loginAsForOnboarding(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    const result = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: "API Test User", level: "beginner", interests: ["Quran"] }),
      });
      return { status: res.status, body: await res.json() };
    });
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
  });

  test("10.14 onboarding API is idempotent for already onboarded user", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);

    const result = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: "Should Not Fail" }),
      });
      return { status: res.status, body: await res.json() };
    });
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
  });
});

test.describe("onboarding API unauthenticated", () => {
  test("10.15 onboarding POST without auth returns 401", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/en");
    const result = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: "Anon" }),
      });
      return res.status;
    });
    expect(result).toBe(401);
    await ctx.close();
  });
});

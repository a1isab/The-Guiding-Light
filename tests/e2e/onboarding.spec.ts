import { test, expect } from "@playwright/test";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";
const SUPABASE_URL = "https://vpqfvranmdhsxfsynvbw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWZ2cmFubWRoc3hmc3ludmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODQxMDAsImV4cCI6MjA5NzQ2MDEwMH0.6QF9SFBcl_c5xFVKxYBduVZuXGRjDqrA_AtFyX4O_gM";

function decodeSupabaseCookie(cookieValue: string): { access_token: string; user?: { id: string } } | null {
  try {
    const b64 = cookieValue.replace(/^base64-/, "");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

async function getCookieValue(page: import("@playwright/test").Page, keyPattern: string): Promise<string | null> {
  return page.evaluate((pattern) => {
    const cookies = document.cookie.split("; ").reduce((acc: Record<string, string>, c) => {
      const [k, ...v] = c.split("=");
      acc[k] = v.join("=");
      return acc;
    }, {});
    const key = Object.keys(cookies).find((k) => k.includes(pattern));
    return key ? cookies[key] : null;
  }, keyPattern) as Promise<string | null>;
}

async function loginAs(page: import("@playwright/test").Page, email: string, password: string): Promise<void> {
  await page.goto("/en/auth/login");
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/(teacher|dashboard)/);
  await page.waitForLoadState("networkidle");
}

async function getAccessToken(page: import("@playwright/test").Page): Promise<string | null> {
  const raw = await getCookieValue(page, "-auth-token");
  if (!raw) return null;
  return decodeSupabaseCookie(raw)?.access_token ?? null;
}

async function setOnboarded(page: import("@playwright/test").Page, onboarded: boolean): Promise<void> {
  const token = await getAccessToken(page);
  expect(token).toBeTruthy();

  const userIdRaw = await page.evaluate(() => {
    const raw = document.cookie.split("; ").find((c) => c.includes("-auth-token"))?.split("=")?.slice(1)?.join("=");
    if (!raw) return null;
    try {
      const b64 = raw.replace(/^base64-/, "");
      return JSON.parse(atob(b64))?.user?.id ?? null;
    } catch { return null; }
  });

  if (!userIdRaw) throw new Error("Could not extract userId from cookie");

  await page.evaluate(
    async ({ url, anonKey, token, uid, onboarded }) => {
      const res = await fetch(`${url}/rest/v1/profiles?user_id=eq.${uid}`, {
        method: "PATCH",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ onboarded, display_name: null, onboarding_data: null }),
      });
      if (!res.ok) throw new Error(`Failed to set onboarded: ${res.status} ${await res.text()}`);
    },
    { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY, token: token!, uid: userIdRaw, onboarded }
  );
}

test.describe.configure({ timeout: 120000 });

test.describe("onboarding wizard for student", () => {
  test("10.1 student sees onboarding wizard when not onboarded", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("onboarding-wizard")).toBeVisible();
    await expect(page.getByTestId("onboarding-step-0")).toBeVisible();

    await setOnboarded(page, true);
  });

  test("10.2 wizard shows step indicator with correct step count", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("onboarding-wizard")).toBeVisible();
    await expect(page.getByText("1 / 5")).toBeVisible();

    await setOnboarded(page, true);
  });

  test("10.3 student can click Next through all steps", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("onboarding-step-0")).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-1")).toBeVisible();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-2")).toBeVisible();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-3")).toBeVisible();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-4")).toBeVisible();

    await setOnboarded(page, true);
  });

  test("10.4 student can go back with Previous button", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-1")).toBeVisible();

    await page.getByRole("button", { name: "Previous" }).click();
    await expect(page.getByTestId("onboarding-step-0")).toBeVisible();

    await setOnboarded(page, true);
  });

  test("10.5 student can enter display name on step 1", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-1")).toBeVisible();

    const nameInput = page.locator('input[placeholder="Your display name"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Test Student");

    await setOnboarded(page, true);
  });

  test("10.6 skip button navigates away from onboarding", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("onboarding-wizard")).toBeVisible();

    await page.getByText("Skip for now").click();
    await page.waitForURL(/\/en\/dashboard/);

    await setOnboarded(page, true);
  });

  test("10.7 complete button is disabled without display name", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    // Navigate to final step
    for (let i = 0; i < 4; i++) {
      await page.getByRole("button", { name: "Next" }).click();
    }
    await expect(page.getByTestId("onboarding-step-4")).toBeVisible();

    const completeBtn = page.getByRole("button", { name: "Complete" });
    await expect(completeBtn).toBeDisabled();

    await setOnboarded(page, true);
  });
});

test.describe("onboarding wizard for teacher", () => {
  test("10.8 teacher sees onboarding wizard with 4 steps", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("onboarding-wizard")).toBeVisible();
    await expect(page.getByText("1 / 4")).toBeVisible();

    await setOnboarded(page, true);
  });

  test("10.9 teacher can navigate through all steps", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await setOnboarded(page, false);

    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-1")).toBeVisible();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-2")).toBeVisible();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("onboarding-step-3")).toBeVisible();

    await setOnboarded(page, true);
  });
});

test.describe("onboarding redirect behavior", () => {
  test("10.10 already onboarded student is redirected from /onboarding to dashboard", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/en\/dashboard/);
  });

  test("10.11 non-onboarded student is redirected from dashboard to onboarding", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
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
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
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
  test("10.15 onboarding POST without auth returns 401", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: "Anon" }),
      });
      return res.status;
    });
    expect(result).toBe(401);
  });
});

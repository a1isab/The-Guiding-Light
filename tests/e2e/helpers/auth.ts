import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const SUPABASE_URL = "https://vpqfvranmdhsxfsynvbw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWZ2cmFubWRoc3hmc3ludmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODQxMDAsImV4cCI6MjA5NzQ2MDEwMH0.6QF9SFBcl_c5xFVKxYBduVZuXGRjDqrA_AtFyX4O_gM";

export function decodeSupabaseCookie(cookieValue: string): { access_token: string; user?: { id: string } } | null {
  try {
    const b64 = cookieValue.replace(/^base64-/, "");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

export async function getCookieValue(page: Page, keyPattern: string): Promise<string | null> {
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

export async function getAccessToken(page: Page): Promise<string | null> {
  const raw = await getCookieValue(page, "-auth-token");
  if (!raw) return null;
  return decodeSupabaseCookie(raw)?.access_token ?? null;
}

export async function getUserId(page: Page): Promise<string | null> {
  const raw = await getCookieValue(page, "-auth-token");
  if (!raw) return null;
  return decodeSupabaseCookie(raw)?.user?.id ?? null;
}

export async function setOnboarded(page: Page, onboarded: boolean): Promise<void> {
  const userId = await getUserId(page);
  if (!userId) throw new Error("Not logged in — cannot set onboarded");
  const res = await page.evaluate(
    async ({ uid, onboarded }) => {
      const r = await fetch("/api/test/onboarded", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, onboarded }),
      });
      return { ok: r.ok, body: await r.json() };
    },
    { uid: userId, onboarded }
  );
  if (!res.ok) throw new Error(`setOnboarded failed: ${JSON.stringify(res.body)}`);
}

export async function loginAs(
  page: Page,
  email: string,
  password: string,
  redirectPattern: RegExp = /\/en\/(teacher|dashboard|admin)/
): Promise<void> {
  await page.goto("/en/auth/login");
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/(teacher|dashboard|admin|onboarding)/);
  await page.waitForLoadState("networkidle");

  if (page.url().includes("/onboarding")) {
    await setOnboarded(page, true);
    if (email.includes("admin")) await page.goto("/en/admin");
    else if (email.includes("teacher")) await page.goto("/en/teacher");
    else await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");
  }
}

export async function loginAsForOnboarding(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/en/auth/login");
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/(teacher|dashboard|admin|onboarding)/);
  await page.waitForLoadState("networkidle");
}

export async function enrollStudent(
  teacherPage: Page,
  classId: string,
  studentUserId: string
): Promise<void> {
  const accessToken = await getAccessToken(teacherPage);
  expect(accessToken).toBeTruthy();

  const ok = await teacherPage.evaluate(
    async ({ url, anonKey, token, cid, sid }) => {
      const res = await fetch(`${url}/rest/v1/class_members`, {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ class_id: cid, student_id: sid }),
      });
      return res.ok;
    },
    { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY, token: accessToken!, cid: classId, sid: studentUserId }
  );
  expect(ok).toBe(true);
}

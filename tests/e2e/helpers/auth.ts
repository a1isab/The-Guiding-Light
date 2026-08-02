import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { parse } from "dotenv";

// Load env from .env.local if available
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const parsed = parse(readFileSync(envPath, "utf-8"));
  for (const [k, v] of Object.entries(parsed)) {
    if (!process.env[k]) process.env[k] = v;
  }
}

const FIXTURES_PATH = resolve(process.cwd(), "tests", "e2e", "fixtures", "auth-tokens.json");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nbwclxbdiuzfxdnbjmti.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5id2NseGJkaXV6ZnhkbmJqbXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NzAyMTQsImV4cCI6MjEwMTI0NjIxNH0.PC_THbSqeGKWJihozd4Vwdg3Rvlwr5LUlDOHblx2yig";

// Derive project ref from URL
function getProjectRef(): string {
  const url = SUPABASE_URL.replace(/:\d+$/, ""); // strip port
  const match = url.match(/https?:\/\/([^.]+)\./);
  if (match) return match[1];
  // For localhost/127.0.0.1, use the host as ref (e.g. "127")
  const hostMatch = url.match(/https?:\/\/([^:/\s]+)/);
  if (hostMatch) return hostMatch[1];
  return "local";
}
const PROJECT_REF = getProjectRef();
const AUTH_COOKIE = `sb-${PROJECT_REF}-auth-token`;

interface CachedToken {
  access_token: string;
  refresh_token: string;
  user_id: string;
  expires_at: number;
}

function readTokenCache(): Record<string, CachedToken | null> {
  if (!existsSync(FIXTURES_PATH)) return {};
  try {
    return JSON.parse(readFileSync(FIXTURES_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function getDest(email: string): string {
  if (email.includes("admin")) return "/en/admin";
  if (email.includes("teacher")) return "/en/teacher";
  return "/en/dashboard";
}

function isTokenExpired(token: CachedToken): boolean {
  return Date.now() / 1000 > token.expires_at;
}

function buildCookieValue(session: {
  access_token: string;
  refresh_token: string;
  user_id: string;
  expires_at: number;
}): string {
  const payload = {
    access_token: session.access_token,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: session.expires_at,
    refresh_token: session.refresh_token,
    user: { id: session.user_id },
  };
  const base64url = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `base64-${base64url}`;
}

export function decodeSupabaseCookie(cookieValue: string): { access_token: string; user?: { id: string } } | null {
  try {
    const b64 = cookieValue.replace(/^base64-/, "");
    return JSON.parse(Buffer.from(b64, "base64url").toString("utf-8"));
  } catch {
    try {
      const b64 = cookieValue.replace(/^base64-/, "");
      return JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
    } catch {
      return null;
    }
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
  const accessToken = await getAccessToken(page);
  const res = await page.evaluate(
    async ({ uid, onboarded, token, supabaseUrl, anonKey }) => {
      const r = await fetch(`${supabaseUrl}/rest/v1/profiles?user_id=eq.${uid}`, {
        method: "PATCH",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ onboarded }),
      });
      return { ok: r.ok, status: r.status };
    },
    { uid: userId, onboarded, token: accessToken!, supabaseUrl: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY }
  );
  if (!res.ok) throw new Error(`setOnboarded failed: ${res.status}`);
}

export async function loginWithCachedToken(
  page: Page,
  email: string,
  _password: string,
  redirectPattern: RegExp
): Promise<void> {
  const tokens = readTokenCache();
  const cached = tokens[email];
  if (!cached) {
    throw new Error(
      `No cached auth token for ${email}. Run "npm run cache:auth" when Supabase is healthy to generate one.`
    );
  }
  if (isTokenExpired(cached)) {
    throw new Error(
      `Cached token for ${email} expired. Run "npm run cache:auth" to regenerate.`
    );
  }

  await page.context().addCookies([
    {
      name: AUTH_COOKIE,
      value: buildCookieValue(cached),
      domain: "localhost",
      path: "/",
      sameSite: "Lax",
    },
  ]);

  const dest = getDest(email);
  await page.goto(dest);
  await page.waitForURL(redirectPattern);
  await page.waitForLoadState("networkidle");

  if (page.url().includes("/onboarding")) {
    await setOnboarded(page, true);
    await page.goto(dest);
    await page.waitForLoadState("networkidle");
  }
}

export async function loginAs(
  page: Page,
  email: string,
  password: string,
  redirectPattern: RegExp = /\/en\/(teacher|dashboard|admin)/
): Promise<void> {
  await page.goto("/en/auth/login");
  await page.evaluate(() => localStorage.setItem("tour_completed", "true"));
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();

  try {
    await page.waitForURL(/\/en\/(teacher|dashboard|admin|onboarding)/, { timeout: 15000 });
    await page.waitForLoadState("networkidle");
  } catch {
    await loginWithCachedToken(page, email, password, redirectPattern);
    return;
  }

  if (page.url().includes("/onboarding")) {
    await setOnboarded(page, true);
    const dest = getDest(email);
    await page.goto(dest);
    await page.waitForLoadState("networkidle");
  }
}

export async function loginAsForOnboarding(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/en/auth/login");
  await page.evaluate(() => localStorage.setItem("tour_completed", "true"));
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();

  try {
    await page.waitForURL(/\/en\/(teacher|dashboard|admin|onboarding)/, { timeout: 15000 });
    await page.waitForLoadState("networkidle");
  } catch {
    const tokens = readTokenCache();
    const cached = tokens[email];
    if (!cached || isTokenExpired(cached)) {
      throw new Error(`No valid cached token for ${email}. Run "npm run cache:auth" to generate.`);
    }
    await page.context().addCookies([
      {
        name: AUTH_COOKIE,
        value: buildCookieValue(cached),
        domain: "localhost",
        path: "/",
        sameSite: "Lax",
      },
    ]);
    await page.goto("/en/onboarding");
    await page.waitForLoadState("networkidle");
  }
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

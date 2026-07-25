import { test, expect } from "@playwright/test";

const STUDENT = { email: "student@theguidinglight.com", password: "Student123!" };
const TEACHER = { email: "teacher@theguidinglight.com", password: "Teacher123!" };
const ADMIN = { email: "admin@theguidinglight.com", password: "Admin123!" };

async function login(page: import("@playwright/test").Page, creds: { email: string; password: string }) {
  await page.goto("/en/auth/login");
  await page.getByTestId("login-email").fill(creds.email);
  await page.getByTestId("login-password").fill(creds.password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("**/dashboard**");
}

async function getThemeColor(page: import("@playwright/test").Page, varName: string): Promise<string> {
  const raw = await page.evaluate((v) => {
    const el = document.querySelector('[style*="var(--bg-primary)"]') || document.documentElement;
    return getComputedStyle(el).getPropertyValue(v).trim();
  }, varName);
  return raw.toLowerCase();
}

async function setTheme(page: import("@playwright/test").Page, theme: "dark" | "light") {
  await page.evaluate((t) => {
    document.documentElement.dataset.theme = t;
    localStorage.setItem("theme", t);
  }, theme);
}

// ── Tasks 53-54: Landing page dark/light ──────────────────────────

test.describe("53-54: Landing page theme", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
  });

  test("53: Dark mode is default — bg-primary is dark", async ({ page }) => {
    const dataTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(dataTheme === undefined || dataTheme !== "light").toBeTruthy();
    const bg = await getThemeColor(page, "--bg-primary");
    const text = await getThemeColor(page, "--text-primary");
    expect(bg).toBe("#0a0d12");
    expect(text).toBe("#f0ece4");
  });

  test("54: Light mode — bg-primary is light", async ({ page }) => {
    await setTheme(page, "light");
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    const bg = await getThemeColor(page, "--bg-primary");
    const text = await getThemeColor(page, "--text-primary");
    expect(bg).toBe("#f5f1eb");
    expect(text).toBe("#1a1d24");
  });
});

// ── Tasks 55-57: Dashboard themes ─────────────────────────────────

test.describe("55-57: Dashboard theme", () => {
  test("55: Student dashboard dark + light", async ({ page }) => {
    await login(page, STUDENT);

    const darkBg = await getThemeColor(page, "--bg-primary");
    expect(darkBg).toBe("#0a0d12");

    await setTheme(page, "light");
    await page.goto("/en/dashboard", { waitUntil: "networkidle" });
    const lightBg = await getThemeColor(page, "--bg-primary");
    expect(lightBg).toBe("#f5f1eb");
  });

  test("56: Teacher dashboard dark + light", async ({ page }) => {
    await login(page, TEACHER);

    const darkBg = await getThemeColor(page, "--bg-primary");
    expect(darkBg).toBe("#0a0d12");

    await setTheme(page, "light");
    await page.goto("/en/teacher", { waitUntil: "networkidle" });
    await page.waitForFunction(() => {
      const el = document.documentElement;
      return getComputedStyle(el).getPropertyValue("--bg-primary").trim().length > 0;
    }, null, { timeout: 10000 });
    const lightBg = await getThemeColor(page, "--bg-primary");
    expect(lightBg).toBe("#f5f1eb");
  });

  test("57: Admin dashboard dark + light", async ({ page }) => {
    await login(page, ADMIN);

    const darkBg = await getThemeColor(page, "--bg-primary");
    expect(darkBg).toBe("#0a0d12");

    await setTheme(page, "light");
    await page.goto("/en/admin", { waitUntil: "networkidle" });
    await page.waitForFunction(() => {
      const el = document.documentElement;
      return getComputedStyle(el).getPropertyValue("--bg-primary").trim().length > 0;
    }, null, { timeout: 10000 });
    const lightBg = await getThemeColor(page, "--bg-primary");
    expect(lightBg).toBe("#f5f1eb");
  });
});

// ── Task 58: Auth pages dark/light ────────────────────────────────

test.describe("58: Auth pages theme", () => {
  test("Login page dark + light", async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    const dark = await getThemeColor(page, "--bg-primary");
    expect(dark).toBe("#0a0d12");

    await setTheme(page, "light");
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    const light = await getThemeColor(page, "--bg-primary");
    expect(light).toBe("#f5f1eb");
  });

  test("Signup page dark + light", async ({ page }) => {
    await page.goto("/en/auth/signup");
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    const dark = await getThemeColor(page, "--bg-primary");
    expect(dark).toBe("#0a0d12");

    await setTheme(page, "light");
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    const light = await getThemeColor(page, "--bg-primary");
    expect(light).toBe("#f5f1eb");
  });
});

// ── Task 59: RTL layout ──────────────────────────────────────────

test.describe("59: RTL layout (ar / ur)", () => {
  test("Arabic locale sets dir=rtl", async ({ page }) => {
    await page.goto("/ar");
    await page.waitForFunction(() => document.documentElement.dir === "rtl", null, { timeout: 5000 });
    expect(await page.locator("html").getAttribute("dir")).toBe("rtl");
    expect(await page.locator("html").getAttribute("lang")).toBe("ar");
  });

  test("Urdu locale sets dir=rtl", async ({ page }) => {
    await page.goto("/ur");
    await page.waitForFunction(() => document.documentElement.dir === "rtl", null, { timeout: 5000 });
    expect(await page.locator("html").getAttribute("dir")).toBe("rtl");
    expect(await page.locator("html").getAttribute("lang")).toBe("ur");
  });

  test("English locale stays ltr", async ({ page }) => {
    await page.goto("/en");
    await page.waitForFunction(() => document.documentElement.dir !== "", null, { timeout: 5000 });
    expect(await page.locator("html").getAttribute("dir")).toBe("ltr");
  });
});

// ── Task 60: Theme persists across reload ─────────────────────────

test.describe("60: Theme persistence", () => {
  test("Theme persists after full page reload", async ({ page }) => {
    await page.goto("/en");
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    await setTheme(page, "light");
    const bg1 = await getThemeColor(page, "--bg-primary");
    expect(bg1).toBe("#f5f1eb");

    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    const bg2 = await getThemeColor(page, "--bg-primary");
    expect(bg2).toBe("#f5f1eb");

    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    expect(stored).toBe("light");
  });
});

// ── Task 61: prefers-reduced-motion ──────────────────────────────

test.describe("61: prefers-reduced-motion", () => {
  test("Animations disabled when reduced motion is preferred", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await page.waitForLoadState("domcontentloaded");

    const result = await page.evaluate(() => {
      const el = document.querySelector(".animate-fade-in-up");
      if (!el) return null;
      const style = getComputedStyle(el);
      return {
        animationName: style.animationName,
        opacity: style.opacity,
        transform: style.transform,
      };
    });

    if (!result) return;
    expect(result.animationName).toBe("none");
    expect(result.opacity).toBe("1");
    expect(result.transform).toBe("none");
  });

  test("Transitions forced to near-zero with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await page.waitForLoadState("domcontentloaded");

    const dur = await page.evaluate(() => {
      const raw = getComputedStyle(document.body).transitionDuration;
      const ms = parseFloat(raw) * 1000;
      return ms;
    });
    expect(dur).toBeLessThanOrEqual(0.1);
  });
});

// ── Task 62: Mobile responsive ───────────────────────────────────

test.describe("62: Mobile responsive (320px → 1440px)", () => {
  const viewports = [
    { name: "320px", width: 320, height: 568 },
    { name: "375px", width: 375, height: 667 },
    { name: "768px", width: 768, height: 1024 },
    { name: "1024px", width: 1024, height: 768 },
    { name: "1440px", width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test(`Landing page renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/en");
      await expect(page.locator("body")).toBeVisible();
      const overflowX = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      expect(overflowX).toBeTruthy();
    });

    test(`Dashboard renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await login(page, STUDENT);
      await expect(page.locator("body")).toBeVisible();
      await page.waitForLoadState("networkidle");
      if (vp.width >= 768) {
        const noOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth <= window.innerWidth + 1;
        });
        expect(noOverflow).toBeTruthy();
      }
    });
  }
});

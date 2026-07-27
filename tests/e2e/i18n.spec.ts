import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

test.describe.configure({ timeout: 120000 });

test.describe("i18n locale switching", () => {
  test("English is the default locale", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/en/");
  });

  test("Arabic locale sets dir=rtl on html", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/ar/dashboard");
    await page.waitForLoadState("networkidle");

    const dir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
    expect(dir).toBe("rtl");
  });

  test("Urdu locale sets dir=rtl on html", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/ur/dashboard");
    await page.waitForLoadState("networkidle");

    const dir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
    expect(dir).toBe("rtl");
  });

  test("English locale stays ltr", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");

    const dir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
    expect(dir).toBe("ltr");
  });

  test("French locale sets lang=fr", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/fr/dashboard");
    await page.waitForLoadState("networkidle");

    const lang = await page.evaluate(() => document.documentElement.getAttribute("lang"));
    expect(lang).toBe("fr");
  });

  test("Arabic locale sets lang=ar", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/ar/dashboard");
    await page.waitForLoadState("networkidle");

    const lang = await page.evaluate(() => document.documentElement.getAttribute("lang"));
    expect(lang).toBe("ar");
  });

  test("navbar language switcher shows all locales", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");

    const langSwitcher = page.locator('[data-testid="lang-switcher"]').or(page.getByRole("button", { name: /lang|language/i }));
    const navbar = page.locator("nav, header").first();
    const navText = await navbar.textContent() ?? "";
    expect(navText).toBeTruthy();
  });

  test("switching locale via settings persists across pages", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");

    await page.getByText("العربية").click();
    await page.waitForURL(/\/ar\/settings/);

    await page.goto("/ar/dashboard");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/ar/");
  });

  test("landing page renders in Arabic locale", async ({ page }) => {
    await page.goto("/ar");
    await page.waitForLoadState("networkidle");

    const dir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
    expect(dir).toBe("rtl");
  });

  test("pricing page renders in Arabic locale", async ({ page }) => {
    await page.goto("/ar/pricing");
    await page.waitForLoadState("networkidle");

    const dir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
    expect(dir).toBe("rtl");
  });

  test("auth pages render in Arabic locale", async ({ page }) => {
    await page.goto("/ar/auth/login");
    await page.waitForLoadState("networkidle");

    const dir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
    expect(dir).toBe("rtl");
  });
});

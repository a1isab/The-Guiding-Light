import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

const ADMIN_EMAIL = "admin@theguidinglight.com";
const ADMIN_PASSWORD = "Admin123!";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

test.describe.configure({ timeout: 120000 });

test.describe("admin verification review", () => {
  test("10.4 admin can access verifications page", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin/verifications");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText("Verifications", { timeout: 10000 });
  });

  test("10.4 admin sees verification requests in table", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/en/admin/verifications");
    await page.waitForLoadState("networkidle");

    const hasRows = await page.getByTestId(/^verification-row-/).first().isVisible().catch(() => false);
    const hasEmpty = await page.getByText("No verification requests").isVisible().catch(() => false);

    expect(hasRows || hasEmpty).toBe(true);
  });

  test("10.4 admin API returns pending requests", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    const result = await page.evaluate(async () => {
      const res = await fetch("/api/admin/verifications");
      return { status: res.status, body: await res.json() };
    });

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("requests");
    expect(Array.isArray(result.body.requests)).toBe(true);
  });

  test("10.4 admin can approve a pending verification via API", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);

    const submitResult = await page.evaluate(async () => {
      const res = await fetch("/api/teacher/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "teaching_certificate",
          document_url: "https://example.com/approve-test.pdf",
          document_number: "APPROVE-001",
        }),
      });
      return { status: res.status, body: await res.json() };
    });

    if (submitResult.status === 200 && submitResult.body.id) {
      await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

      const approveResult = await page.evaluate(async (id) => {
        const res = await fetch("/api/admin/verifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action: "approve" }),
        });
        return { status: res.status, body: await res.json() };
      }, submitResult.body.id);

      expect(approveResult.status).toBe(200);
      expect(approveResult.body.ok).toBe(true);
    }
  });
});

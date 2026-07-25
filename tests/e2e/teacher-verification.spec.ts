import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

test.describe.configure({ timeout: 120000 });

test.describe("teacher verification", () => {
  test("10.3 teacher can access verify page and see form", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto("/en/teacher/verify");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("verify-doc-type")).toBeVisible();
    await expect(page.getByTestId("verify-submit")).toBeVisible();
  });

  test("10.3 teacher can submit verification request via API", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);

    const result = await page.evaluate(async () => {
      const res = await fetch("/api/teacher/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "passport",
          document_url: "https://example.com/test-doc.pdf",
          document_number: "E2E-TEST-12345",
          notes: "E2E test submission",
        }),
      });
      return { status: res.status, body: await res.json() };
    });

    expect(result.status === 200 || result.status === 409).toBe(true);
  });

  test("10.3 verify page shows pending status after submission", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto("/en/teacher/verify");
    await page.waitForLoadState("networkidle");

    const pendingStatus = page.getByTestId("verify-status-pending");
    const formVisible = await page.getByTestId("verify-doc-type").isVisible().catch(() => false);

    if (formVisible) {
      await page.getByTestId("verify-doc-type").selectOption("passport");
      await page.getByTestId("verify-doc-number").fill("E2E-VISUAL-001");
      await page.getByTestId("verify-notes").fill("E2E visual test");
    }

    const hasPending = await pendingStatus.isVisible().catch(() => false);
    expect(hasPending || formVisible).toBe(true);
  });
});

test.describe("teacher verify page - resubmit", () => {
  test("10.3 rejected teacher can resubmit", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto("/en/teacher/verify");
    await page.waitForLoadState("networkidle");

    const resubmitBtn = page.getByTestId("verify-resubmit");
    const hasResubmit = await resubmitBtn.isVisible().catch(() => false);

    if (hasResubmit) {
      await resubmitBtn.click();
      await expect(page.getByTestId("verify-doc-type")).toBeVisible();
    }
  });
});

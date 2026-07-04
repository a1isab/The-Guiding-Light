import { test, expect } from "@playwright/test";

const EMAIL = "teacher@theguidinglight.com";
const PASSWORD = "Teacher123!";
const CLASS_NAME = "E2E Test Class " + Date.now();

test.beforeEach(async ({ page }) => {
  await page.goto("/en/auth/login");
  await page.getByTestId("login-email").fill(EMAIL);
  await page.getByTestId("login-password").fill(PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/teacher/);
});

test("teacher can create a class", async ({ page }) => {
  await page.goto("/en/teacher/classes/new");
  await page.getByTestId("class-name-input").fill(CLASS_NAME);
  await page.getByTestId("class-description").fill("Created by E2E test");
  await page.getByTestId("class-submit").click();
  await page.waitForURL(/\/en\/teacher\/classes\//);
  expect(page.url()).toMatch(/\/en\/teacher\/classes\//);
});

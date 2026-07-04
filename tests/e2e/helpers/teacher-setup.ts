import { type Page } from "@playwright/test";

const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

export interface TestData {
  classId: string;
  courseId: string;
  sectionId: string;
  lessonId: string;
  locale: string;
  inviteCode: string;
}

async function apiPost(page: Page, url: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  return page.evaluate(async ([u, b]) => {
    const res = await fetch(u, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(b),
    });
    return res.json();
  }, [url, body] as const);
}

export async function setupTeacherLesson(page: Page): Promise<TestData> {
  const locale = "en";
  const ts = Date.now();

  await page.goto(`/${locale}/auth/login`);
  await page.getByTestId("login-email").fill(TEACHER_EMAIL);
  await page.getByTestId("login-password").fill(TEACHER_PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/teacher/);

  await page.goto(`/${locale}/teacher/classes/new`);
  await page.getByTestId("class-name-input").fill(`E2E Class ${ts}`);
  await page.getByTestId("class-description").fill(`Auto-created by E2E test ${ts}`);
  await page.getByTestId("class-submit").click();
  await page.waitForURL(/\/en\/teacher\/classes\//);
  await page.waitForLoadState("networkidle");
  const classId = page.url().split("/classes/")[1]?.split(/[?#/]/)[0];
  if (!classId) throw new Error("Could not extract classId");

  const courseData = await apiPost(page, "/api/teacher/courses", {
    classId, title: `E2E Course ${ts}`, description: "Auto-created by E2E test",
  });
  if (!courseData.id) throw new Error("Course creation failed: " + JSON.stringify(courseData));
  const courseId = courseData.id as string;

  const sectionData = await apiPost(page, "/api/teacher/sections", {
    courseId, title: `E2E Section ${ts}`, orderIndex: 0,
  });
  if (!sectionData.id) throw new Error("Section creation failed: " + JSON.stringify(sectionData));
  const sectionId = sectionData.id as string;

  const lessonData = await apiPost(page, "/api/teacher/lessons", {
    sectionId,
    title: `E2E Lesson ${ts}`,
    content: `## E2E Test Lesson\n\nCreated at ${new Date().toISOString()}.`,
    orderIndex: 0,
  });
  if (!lessonData.id) throw new Error("Lesson creation failed: " + JSON.stringify(lessonData));
  const lessonId = lessonData.id as string;

  // Regenerate invite code to ensure it's valid, and capture it
  const inviteData = await apiPost(page, "/api/teacher/classes/invite", { classId });
  const inviteCode = (inviteData.invite_code as string) ?? "";
  if (!inviteCode) throw new Error("Invite code regeneration failed: " + JSON.stringify(inviteData));

  return { classId, courseId, sectionId, lessonId, locale, inviteCode };
}

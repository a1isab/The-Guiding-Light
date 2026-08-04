import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function readEnv(key: string): string | undefined {
  const env = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
  const match = env.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match?.[1]?.trim();
}

/**
 * Warms the hosted Supabase connection pool before the suite starts.
 * The free-tier pool drops idle connections; the first queries after a
 * gap then hit 5-20s cold starts that can exceed PostgREST statement
 * timeouts (57014). Warming up front makes the whole suite reliable.
 */
export default async function globalSetup() {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) return;

  const client = createClient(url, serviceRoleKey);
  const tables = [
    "profiles",
    "classes",
    "class_members",
    "teacher_courses",
    "teacher_sections",
    "teacher_lessons",
    "assignments",
    "submissions",
    "lesson_comments",
    "user_badges",
    "progress",
    "certificates",
  ];
  for (const table of tables) {
    try {
      await client.from(table).select("id", { count: "exact", head: true });
    } catch {}
  }
}

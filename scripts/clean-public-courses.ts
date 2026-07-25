import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function clean() {
  console.log("Cleaning public course tables...\n");

  // Delete in FK order: quizzes → lessons → sections → courses
  for (const table of ["quizzes", "lessons", "sections", "courses"]) {
    const { error, count } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      console.error(`  ❌ Error deleting from ${table}:`, error.message);
    } else {
      console.log(`  ✅ ${table}: deleted ${count ?? 0} rows`);
    }
  }

  console.log("\nDone! All public course data removed.");
}

clean().catch((err) => {
  console.error("❌ Clean failed:", err);
  process.exit(1);
});

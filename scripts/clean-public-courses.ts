const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function clean() {
  console.log("Cleaning public course tables...\n");

  for (const table of ["quizzes", "lessons", "sections", "courses"]) {
    const res = await fetch(
      `${url}/rest/v1/${table}?id=neq.00000000-0000-0000-0000-000000000000`,
      {
        method: "DELETE",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: "return=representation",
        },
      }
    );
    if (!res.ok) {
      console.error(`  ❌ ${table}: ${res.status} ${await res.text()}`);
    } else {
      const rows = await res.json();
      console.log(`  ✅ ${table}: deleted ${rows?.length ?? 0} rows`);
    }
  }

  console.log("\nDone! All public course data removed.");
}

clean().catch((err) => {
  console.error("❌ Clean failed:", err);
  process.exit(1);
});

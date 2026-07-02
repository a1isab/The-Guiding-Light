import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const users = [
  {
    email: "admin@theguidinglight.com",
    password: "admin123",
    role: "admin" as const,
  },
  {
    email: "teacher@theguidinglight.com",
    password: "teacher123",
    role: "teacher" as const,
  },
  {
    email: "student@theguidinglight.com",
    password: "student123",
    role: "student" as const,
  },
];

async function seedUsers() {
  console.log("🌱 Seeding users...");

  const { data: { users: allAuthUsers } } = await supabase.auth.admin.listUsers();
  const authMap = new Map<string, (typeof allAuthUsers)[number]>();
  for (const au of allAuthUsers ?? []) {
    authMap.set(au.email ?? "", au);
  }

  for (const u of users) {
    const existing = authMap.get(u.email);

    if (existing) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: u.role })
        .eq("user_id", existing.id);

      if (profileError) {
        console.error(`  ❌ ${u.email}: profile update failed — ${profileError.message}`);
      } else {
        console.log(`  ✅ ${u.email} (${u.role}) — already existed, role updated`);
      }
      continue;
    }

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    });

    if (createError) {
      console.error(`  ❌ ${u.email}: failed to create — ${createError.message}`);
      continue;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: u.role })
      .eq("user_id", newUser.user.id);

    if (profileError) {
      console.error(`  ❌ ${u.email}: profile update failed — ${profileError.message}`);
    } else {
      console.log(`  ✅ ${u.email} (${u.role}) — created`);
    }
  }

  console.log("✅ User seed complete!");
}

seedUsers().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

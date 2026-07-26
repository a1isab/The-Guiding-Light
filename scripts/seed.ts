import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Idempotent insert: check by a match column, then insert or skip.
 * Supabase upsert() requires a unique constraint on the conflict columns,
 * which teacher_courses and teacher_sections lack on (class_id, title).
 */
async function upsertOrSkip<T extends Record<string, unknown>>(
  table: string,
  matchColumn: string,
  matchValue: string,
  row: T
): Promise<{ data: T & { id: string } | null; created: boolean }> {
  // Check if exists
  const { data: existing } = await supabase
    .from(table)
    .select("id")
    .eq(matchColumn, matchValue)
    .maybeSingle();

  if (existing) {
    // Already exists — return with a no-op
    return { data: { id: existing.id, ...row } as T & { id: string }, created: false };
  }

  const { data, error } = await supabase
    .from(table)
    .insert(row as any)
    .select()
    .single();

  if (error) throw new Error(`${table} insert failed: ${error.message}`);
  return { data: data as T & { id: string }, created: true };
}

async function seed() {
  console.log("🌱 Seeding teacher demo class with courses...");

  // ─── Get the teacher user ────────────────────────────────────────
  const { data: teacherProfile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("role", "teacher")
    .limit(1)
    .single();

  if (!teacherProfile) {
    console.error("❌ No teacher profile found. Run `npm run seed:users` first.");
    process.exit(1);
  }

  const teacherId = teacherProfile.user_id;

  // ─── Create a demo class ─────────────────────────────────────────
  let { data: cls } = await supabase
    .from("classes")
    .select("id, name, invite_code")
    .eq("invite_code", "DEMO101")
    .maybeSingle();

  if (!cls) {
    const { data: newCls, error: clsErr } = await supabase
      .from("classes")
      .insert({
        teacher_id: teacherId,
        name: "Islamic Studies 101",
        description: "A foundational course covering the essentials of Islamic knowledge.",
        invite_code: "DEMO101",
        invite_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("id, name, invite_code")
      .single();

    if (clsErr) {
      console.error("❌ Failed to create class:", clsErr.message);
      process.exit(1);
    }
    cls = newCls;
    console.log(`  ✅ Created class "${cls.name}"`);
  } else {
    console.log(`  ℹ️  Class "${cls.name}" already exists`);
  }

  // ─── Course 1: New Muslim Guide ───────────────────────────────────
  const { data: course1 } = await upsertOrSkip(
    "teacher_courses", "title", "New Muslim Guide",
    {
      class_id: cls!.id,
      teacher_id: teacherId,
      title: "New Muslim Guide",
      description: "Start your journey here. Learn the fundamentals of Islam from scratch.",
      order_index: 1,
    }
  );
  console.log(`  ${course1 ? (course1 as any).__created ? "✅" : "ℹ️" : "❌"} Course "${course1?.title}"`);

  async function ensureSection(courseId: string, title: string, orderIndex: number) {
    const { data } = await upsertOrSkip(
      "teacher_sections", "title", title,
      { course_id: courseId, title, order_index: orderIndex }
    );
    return data;
  }

  async function ensureLessons(sectionId: string, lessons: { title: string; content: string; order_index: number }[]) {
    for (const lesson of lessons) {
      await upsertOrSkip(
        "teacher_lessons", "title", lesson.title,
        { section_id: sectionId, ...lesson }
      );
    }
  }

  // Section 1.1
  const s1 = await ensureSection(course1!.id, "The Basics", 1);
  if (s1) {
    await ensureLessons(s1.id, [
      { title: "What is Islam?", order_index: 1,
        content: `Islam is a monotheistic religion based on the belief in one God (Allah). It is the complete submission to the will of Allah.

The five pillars of Islam form the foundation of a Muslim\'s faith and practice:

1. **Shahada** (Declaration of Faith)
2. **Salah** (Prayer)
3. **Zakat** (Charity)
4. **Sawm** (Fasting)
5. **Hajj** (Pilgrimage)` },
      { title: "The Six Articles of Faith", order_index: 2,
        content: `In Islam, there are six articles of faith:

1. Belief in Allah
2. Belief in Angels
3. Belief in Divine Books
4. Belief in Prophets
5. Belief in the Day of Judgment
6. Belief in Divine Decree (Qadr)

These beliefs are derived from the Quran and authentic Hadith.` },
      { title: "How to Pray (Salah)", order_index: 3,
        content: `Salah (prayer) is the second pillar of Islam. It is performed five times a day: Fajr, Dhuhr, Asr, Maghrib, and Isha.

Before praying, one must perform wudu (ablution). Each prayer consists of a specific number of rak\'ahs (units of prayer).` },
    ]);
    console.log("    ✅ Section 'The Basics' (3 lessons)");
  }

  // Section 1.2
  const s2 = await ensureSection(course1!.id, "Daily Life as a Muslim", 2);
  if (s2) {
    await ensureLessons(s2.id, [
      { title: "Purification (Tahara)", order_index: 1,
        content: `Tahara (purification) is an essential part of Islamic practice. It includes wudu (ablution), ghusl (full bath), and tayammum (dry ablution).\n\nCleanliness is half of faith, and Muslims are encouraged to be clean in body, clothing, and environment.` },
      { title: "Halal & Haram", order_index: 2,
        content: `Halal refers to what is permissible in Islam, while Haram refers to what is forbidden. These categories cover food, drink, behavior, and business transactions.\n\nThe Quran and Sunnah provide clear guidance on what is allowed and what is prohibited.` },
      { title: "Building Good Character", order_index: 3,
        content: `Good character (akhlaq) is central to Islam. The Prophet Muhammad (peace be upon him) said: 'The best among you are those who have the best manners and character.'\n\nKey traits include honesty, patience, kindness, humility, and generosity.` },
    ]);
    console.log("    ✅ Section 'Daily Life as a Muslim' (3 lessons)");
  }

  // ─── Course 2: Aqeedah Basics ──────────────────────────────────────
  const { data: course2 } = await upsertOrSkip(
    "teacher_courses", "title", "Aqeedah Basics",
    {
      class_id: cls!.id,
      teacher_id: teacherId,
      title: "Aqeedah Basics",
      description: "Understand the core beliefs of Ahlus-Sunnah wal-Jama'ah.",
      order_index: 2,
    }
  );
  console.log(`  ℹ️  Course "${course2?.title}"`);

  const s3 = await ensureSection(course2!.id, "Tawheed (Oneness of Allah)", 1);
  if (s3) {
    await ensureLessons(s3.id, [
      { title: "What is Tawheed?", order_index: 1,
        content: `Tawheed is the most fundamental concept in Islam. It means the oneness and uniqueness of Allah.\n\nTawheed is divided into three categories:\n1. **Tawheed ar-Rububiyyah** (Oneness of Lordship)\n2. **Tawheed al-Uluhiyyah** (Oneness of Worship)\n3. **Tawheed al-Asma was-Sifat** (Oneness of Names and Attributes)` },
      { title: "Shirk and Its Types", order_index: 2,
        content: `Shirk is the opposite of Tawheed. It means associating partners with Allah and is the greatest sin in Islam.\n\nTypes of Shirk:\n1. **Major Shirk (Shirk al-Akbar)** — takes a person out of Islam\n2. **Minor Shirk (Shirk al-Asghar)** — such as showing off in worship\n3. **Hidden Shirk (Shirk al-Khafi)** — subtle reliance on other than Allah` },
    ]);
    console.log("    ✅ Section 'Tawheed' (2 lessons)");
  }

  const s4 = await ensureSection(course2!.id, "Faith & Practice", 2);
  if (s4) {
    await ensureLessons(s4.id, [
      { title: "The Quran: The Final Revelation", order_index: 1,
        content: `The Quran is the literal word of Allah revealed to Prophet Muhammad (peace be upon him) through Angel Jibril. It is the final and most complete divine book.\n\nThe Quran contains guidance for all aspects of life — spiritual, social, and moral. It is preserved in its original Arabic language.` },
      { title: "The Prophets of Islam", order_index: 2,
        content: `Muslims believe in all prophets sent by Allah, from Adam to Muhammad (peace be upon them all). Prophets were chosen by Allah to guide humanity.\n\nKey prophets include Nuh (Noah), Ibrahim (Abraham), Musa (Moses), Isa (Jesus), and Muhammad (peace be upon them all).` },
    ]);
    console.log("    ✅ Section 'Faith & Practice' (2 lessons)");
  }

  // ─── Course 3: Arabic Alphabet ────────────────────────────────────
  const { data: course3 } = await upsertOrSkip(
    "teacher_courses", "title", "Arabic Alphabet",
    {
      class_id: cls!.id,
      teacher_id: teacherId,
      title: "Arabic Alphabet",
      description: "Learn to read and recognize the Arabic alphabet for Quran recitation.",
      order_index: 3,
    }
  );
  console.log(`  ℹ️  Course "${course3?.title}"`);

  const s5 = await ensureSection(course3!.id, "Letters & Pronunciation", 1);
  if (s5) {
    await ensureLessons(s5.id, [
      { title: "Introduction to Arabic Script", order_index: 1,
        content: `Arabic is written from right to left and has 28 letters. Each letter can have up to 4 forms depending on position in a word.\n\nThe Arabic alphabet is phonetic — words are pronounced as written, making reading consistent once you learn the letters.` },
      { title: "The 28 Letters", order_index: 2,
        content: `The 28 Arabic letters:\n\nا (Alif), ب (Ba), ت (Ta), ث (Tha), ج (Jim), ح (Ha), خ (Kha), د (Dal), ذ (Dhal), ر (Ra), ز (Zay), س (Sin), ش (Shin), ص (Sad), ض (Dad), ط (Ta), ظ (Dha), ع (Ayn), غ (Ghayn), ف (Fa), ق (Qaf), ك (Kaf), ل (Lam), م (Mim), ن (Nun), ه (Ha), و (Waw), ي (Ya)` },
      { title: "Vowels & Pronunciation", order_index: 3,
        content: `Arabic has three short vowels: Fatha (a), Kasra (i), Damma (u) and three long vowels: Alif (aa), Ya (ee), Waw (oo).\n\nShort vowels are written as diacritical marks above or below letters. Sukun indicates no vowel, and Shaddah indicates doubling of a consonant.` },
    ]);
    console.log("    ✅ Section 'Letters & Pronunciation' (3 lessons)");
  }

  console.log("✅ Seed complete!");
  console.log(`\n📋 Invite Code: ${cls!.invite_code}`);
  console.log(`🔗 Join URL: /join/${cls!.invite_code}`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log("🌱 Seeding courses...");

  // ─── Course 1: New Muslim Guide ───────────────────────────────────
  const { data: course1, error: e1 } = await supabase
    .from("courses")
    .upsert(
      {
        title: "New Muslim Guide",
        description: "Start your journey here. Learn the fundamentals of Islam from scratch.",
        level: "beginner",
        slug: "new-muslim-guide",
        order_index: 1,
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (e1) console.error("Course 1 error:", e1);
  if (course1) {
    // Section 1
    const { data: s1 } = await supabase
      .from("sections")
      .upsert(
        { course_id: course1.id, title: "The Basics", slug: "the-basics", order_index: 1 },
        { onConflict: "course_id, slug" }
      )
      .select()
      .single();

    if (s1) {
      await supabase.from("lessons").upsert([
        { section_id: s1.id, title: "What is Islam?", slug: "what-is-islam", content: "Islam is a monotheistic religion based on the belief in one God (Allah). It is the complete submission to the will of Allah.\n\nThe five pillars of Islam form the foundation of a Muslim's faith and practice:\n\n1. Shahada (Declaration of Faith)\n2. Salah (Prayer)\n3. Zakat (Charity)\n4. Sawm (Fasting)\n5. Hajj (Pilgrimage)", video_url: null, order_index: 1 },
        { section_id: s1.id, title: "The Six Articles of Faith", slug: "six-articles-of-faith", content: "In Islam, there are six articles of faith:\n\n1. Belief in Allah\n2. Belief in Angels\n3. Belief in Divine Books\n4. Belief in Prophets\n5. Belief in the Day of Judgment\n6. Belief in Divine Decree (Qadr)\n\nThese beliefs are derived from the Quran and authentic Hadith.", video_url: null, order_index: 2 },
        { section_id: s1.id, title: "How to Pray (Salah)", slug: "how-to-pray", content: "Salah (prayer) is the second pillar of Islam. It is performed five times a day: Fajr, Dhuhr, Asr, Maghrib, and Isha.\n\nBefore praying, one must perform wudu (ablution). Each prayer consists of a specific number of rak'ahs (units of prayer).", video_url: null, order_index: 3 },
      ]);
      console.log("  ✅ New Muslim Guide > The Basics (3 lessons)");
    }

    // Section 2
    const { data: s2 } = await supabase
      .from("sections")
      .upsert(
        { course_id: course1.id, title: "Daily Life as a Muslim", slug: "daily-life", order_index: 2 },
        { onConflict: "course_id, slug" }
      )
      .select()
      .single();

    if (s2) {
      await supabase.from("lessons").upsert([
        { section_id: s2.id, title: "Purification (Tahara)", slug: "purification-tahara", content: "Tahara (purification) is an essential part of Islamic practice. It includes wudu (ablution), ghusl (full bath), and tayammum (dry ablution).\n\nCleanliness is half of faith, and Muslims are encouraged to be clean in body, clothing, and environment.", video_url: null, order_index: 1 },
        { section_id: s2.id, title: "Halal & Haram", slug: "halal-haram", content: "Halal refers to what is permissible in Islam, while Haram refers to what is forbidden. These categories cover food, drink, behavior, and business transactions.\n\nThe Quran and Sunnah provide clear guidance on what is allowed and what is prohibited.", video_url: null, order_index: 2 },
        { section_id: s2.id, title: "Building Good Character", slug: "building-good-character", content: "Good character (akhlaq) is central to Islam. The Prophet Muhammad (peace be upon him) said: 'The best among you are those who have the best manners and character.'\n\nKey traits include honesty, patience, kindness, humility, and generosity.", video_url: null, order_index: 3 },
      ]);
      console.log("  ✅ New Muslim Guide > Daily Life (3 lessons)");
    }
  }

  // ─── Course 2: Aqeedah Basics ──────────────────────────────────────
  const { data: course2, error: e2 } = await supabase
    .from("courses")
    .upsert(
      {
        title: "Aqeedah Basics",
        description: "Understand the core beliefs of Ahlus-Sunnah wal-Jama'ah.",
        level: "beginner",
        slug: "aqeedah-basics",
        order_index: 2,
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (e2) console.error("Course 2 error:", e2);
  if (course2) {
    const { data: s1 } = await supabase
      .from("sections")
      .upsert(
        { course_id: course2.id, title: "Tawheed (Oneness of Allah)", slug: "tawheed", order_index: 1 },
        { onConflict: "course_id, slug" }
      )
      .select()
      .single();

    if (s1) {
      await supabase.from("lessons").upsert([
        { section_id: s1.id, title: "What is Tawheed?", slug: "what-is-tawheed", content: "Tawheed is the most fundamental concept in Islam. It means the oneness and uniqueness of Allah.\n\nTawheed is divided into three categories:\n1. Tawheed ar-Rububiyyah (Oneness of Lordship)\n2. Tawheed al-Uluhiyyah (Oneness of Worship)\n3. Tawheed al-Asma was-Sifat (Oneness of Names and Attributes)", video_url: null, order_index: 1 },
        { section_id: s1.id, title: "Shirk and Its Types", slug: "shirk-and-types", content: "Shirk is the opposite of Tawheed. It means associating partners with Allah and is the greatest sin in Islam.\n\nTypes of Shirk:\n1. Major Shirk (Shirk al-Akbar) — takes a person out of Islam\n2. Minor Shirk (Shirk al-Asghar) — such as showing off in worship\n3. Hidden Shirk (Shirk al-Khafi) — subtle reliance on other than Allah", video_url: null, order_index: 2 },
      ]);
      console.log("  ✅ Aqeedah Basics > Tawheed (2 lessons)");
    }

    const { data: s2 } = await supabase
      .from("sections")
      .upsert(
        { course_id: course2.id, title: "Faith & Practice", slug: "faith-practice", order_index: 2 },
        { onConflict: "course_id, slug" }
      )
      .select()
      .single();

    if (s2) {
      await supabase.from("lessons").upsert([
        { section_id: s2.id, title: "The Quran: The Final Revelation", slug: "quran-final-revelation", content: "The Quran is the literal word of Allah revealed to Prophet Muhammad (peace be upon him) through Angel Jibril. It is the final and most complete divine book.\n\nThe Quran contains guidance for all aspects of life — spiritual, social, and moral. It is preserved in its original Arabic language.", video_url: null, order_index: 1 },
        { section_id: s2.id, title: "The Prophets of Islam", slug: "prophets-of-islam", content: "Muslims believe in all prophets sent by Allah, from Adam to Muhammad (peace be upon them all). Prophets were chosen by Allah to guide humanity.\n\nKey prophets include Nuh (Noah), Ibrahim (Abraham), Musa (Moses), Isa (Jesus), and Muhammad (peace be upon them all).", video_url: null, order_index: 2 },
      ]);
      console.log("  ✅ Aqeedah Basics > Faith & Practice (2 lessons)");
    }
  }

  // ─── Course 3: Arabic Alphabet ────────────────────────────────────
  const { data: course3, error: e3 } = await supabase
    .from("courses")
    .upsert(
      {
        title: "Arabic Alphabet",
        description: "Learn to read and recognize the Arabic alphabet for Quran recitation.",
        level: "beginner",
        slug: "arabic-alphabet",
        order_index: 3,
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (e3) console.error("Course 3 error:", e3);
  if (course3) {
    const { data: s1 } = await supabase
      .from("sections")
      .upsert(
        { course_id: course3.id, title: "Letters & Pronunciation", slug: "letters-pronunciation", order_index: 1 },
        { onConflict: "course_id, slug" }
      )
      .select()
      .single();

    if (s1) {
      await supabase.from("lessons").upsert([
        { section_id: s1.id, title: "Introduction to Arabic Script", slug: "intro-arabic-script", content: "Arabic is written from right to left and has 28 letters. Each letter can have up to 4 forms depending on position in a word.\n\nThe Arabic alphabet is phonetic — words are pronounced as written, making reading consistent once you learn the letters.", video_url: null, order_index: 1 },
        { section_id: s1.id, title: "The 28 Letters", slug: "the-28-letters", content: "The 28 Arabic letters: ا (Alif), ب (Ba), ت (Ta), ث (Tha), ج (Jim), ح (Ha), خ (Kha), د (Dal), ذ (Dhal), ر (Ra), ز (Zay), س (Sin), ش (Shin), ص (Sad), ض (Dad), ط (Ta), ظ (Dha), ع (Ayn), غ (Ghayn), ف (Fa), ق (Qaf), ك (Kaf), ل (Lam), م (Mim), ن (Nun), ه (Ha), و (Waw), ي (Ya)", video_url: null, order_index: 2 },
        { section_id: s1.id, title: "Vowels & Pronunciation", slug: "vowels-pronunciation", content: "Arabic has three short vowels: Fatha (a), Kasra (i), Damma (u) and three long vowels: Alif (aa), Ya (ee), Waw (oo).\n\nShort vowels are written as diacritical marks above or below letters. Sukun indicates no vowel, and Shaddah indicates doubling of a consonant.", video_url: null, order_index: 3 },
      ]);
      console.log("  ✅ Arabic Alphabet > Letters & Pronunciation (3 lessons)");
    }
  }

  console.log("✅ Seed complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

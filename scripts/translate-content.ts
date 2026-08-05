import { createClient } from "@supabase/supabase-js";
import translate from "@iamtraction/google-translate";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface QuizQuestion {
  question: string;
  options: string[];
}

const SOURCE = "en";
const TARGETS = ["ar", "ur", "fr"];

async function translateText(text: string, target: string): Promise<string> {
  if (!text.trim()) return text;
  if (!/[a-zA-Z]/.test(text)) return text;
  if (text.length < 3) return text;
  try {
    const result = await translate(text, { from: SOURCE, to: target });
    return result.text;
  } catch {
    console.warn(`  ⚠️  Failed to translate "${text.slice(0, 50)}..." → ${target}`);
    return text;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("🚀 Starting content translation...\n");
  // ─── Courses ────────────────────────────────────────
  console.log("📚 Translating courses...");
  const { data: courses } = await supabase.from("courses").select("id, title, description");
  for (const course of courses ?? []) {
    const translations: Record<string, { title: string; description: string }> = { en: { title: course.title, description: course.description } };
    for (const target of TARGETS) {
      const [tt, td] = await Promise.all([
        translateText(course.title, target),
        translateText(course.description, target),
      ]);
      translations[target] = { title: tt, description: td };
    }
    await supabase
      .from("courses")
      .update({ translations })
      .eq("id", course.id);
    console.log(`  ✓ ${course.title}`);
    await sleep(300);
  }

  // ─── Sections ───────────────────────────────────────
  console.log("\n📖 Translating sections...");
  const { data: sections } = await supabase.from("sections").select("id, title");
  for (const section of sections ?? []) {
    const translations: Record<string, { title: string }> = { en: { title: section.title } };
    for (const target of TARGETS) {
      const tt = await translateText(section.title, target);
      translations[target] = { title: tt };
    }
    await supabase
      .from("sections")
      .update({ translations })
      .eq("id", section.id);
    console.log(`  ✓ ${section.title}`);
    await sleep(200);
  }

  // ─── Lessons ────────────────────────────────────────
  console.log("\n📝 Translating lessons...");
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, content");
  for (const lesson of lessons ?? []) {
    const translations: Record<string, { title: string; content: string }> = {
      en: { title: lesson.title, content: lesson.content },
    };
    for (const target of TARGETS) {
      const [tt, tc] = await Promise.all([
        translateText(lesson.title, target),
        translateText(lesson.content, target),
      ]);
      translations[target] = { title: tt, content: tc };
    }
    await supabase
      .from("lessons")
      .update({ translations })
      .eq("id", lesson.id);
    console.log(`  ✓ ${lesson.title}`);
    await sleep(500);
  }

  // ─── Quizzes (questions) ────────────────────────────
  console.log("\n❓ Translating quiz questions...");

  // Collect all unique strings to translate (deduplicate)
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, questions");

  const uniqueStrings: Set<string> = new Set();
  const quizMap: { id: string; questions: QuizQuestion[] }[] = [];

  for (const quiz of quizzes ?? []) {
    const questions = quiz.questions as QuizQuestion[];
    quizMap.push({ id: quiz.id, questions });
    for (const q of questions) {
      uniqueStrings.add(q.question);
      for (const opt of (q.options as string[]) ?? []) {
        uniqueStrings.add(opt);
      }
    }
  }

  const stringList = Array.from(uniqueStrings);
  console.log(`  ${stringList.length} unique strings to translate (${quizzes?.length ?? 0} quizzes)`);

  // Translate each unique string to each target
  const translationCache: Record<string, Record<string, string>> = {};
  for (const target of TARGETS) {
    console.log(`  Translating to ${target}...`);
    const batch: { original: string; translated: string }[] = [];
    for (let i = 0; i < stringList.length; i++) {
      const t = await translateText(stringList[i], target);
      batch.push({ original: stringList[i], translated: t });
      if (i % 2 === 1) await sleep(400);
      process.stdout.write(`    ${i + 1}/${stringList.length}\r`);
    }
    for (const b of batch) {
      if (!translationCache[b.original]) translationCache[b.original] = {};
      translationCache[b.original][target] = b.translated;
    }
  }

  // Update quizzes with translated data
  console.log(`  Writing translations to ${quizzes?.length ?? 0} quizzes...`);
  for (const entry of quizMap) {
    const translatedQuestions = entry.questions.map((q: QuizQuestion) => ({
      ...q,
      question_ar: translationCache[q.question]?.ar ?? q.question,
      question_ur: translationCache[q.question]?.ur ?? q.question,
      question_fr: translationCache[q.question]?.fr ?? q.question,
      options_ar: (q.options as string[]).map((o: string) => translationCache[o]?.ar ?? o),
      options_ur: (q.options as string[]).map((o: string) => translationCache[o]?.ur ?? o),
      options_fr: (q.options as string[]).map((o: string) => translationCache[o]?.fr ?? o),
    }));
    await supabase
      .from("quizzes")
      .update({ questions: translatedQuestions })
      .eq("id", entry.id);
    console.log(`  ✓ Quiz ${entry.id.slice(0, 8)}...`);
  }

  console.log("\n✅ All content translated!");
}

main().catch(console.error);

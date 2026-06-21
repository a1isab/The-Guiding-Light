import { createClient } from "@supabase/supabase-js";
import translate from "@iamtraction/google-translate";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SOURCE = "en";
const TARGETS = ["ar", "ur", "fr"];

async function translateText(text: string, target: string): Promise<string> {
  if (!text.trim()) return text;
  if (!/[a-zA-Z]/.test(text)) return text;
  if (text.length < 3) return text;
  try {
    const result = await translate(text, { from: SOURCE, to: target });
    return result.text;
  } catch (err) {
    console.warn(`  ⚠️  Failed to translate "${text.slice(0, 50)}..." → ${target}`);
    return text;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateBatch(
  items: { id: string; text: string; field: string }[],
  target: string
): Promise<{ id: string; field: string; translated: string }[]> {
  const results: { id: string; field: string; translated: string }[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const translated = await translateText(item.text, target);
    results.push({ id: item.id, field: item.field, translated });
    if (i % 3 === 2) await sleep(500);
  }
  return results;
}

async function main() {
  console.log("🚀 Starting content translation...\n");

  // ─── Courses ────────────────────────────────────────
  console.log("📚 Translating courses...");
  const { data: courses } = await supabase.from("courses").select("id, title, description");
  for (const course of courses ?? []) {
    const translations: Record<string, any> = { en: { title: course.title, description: course.description } };
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
    const translations: Record<string, any> = { en: { title: section.title } };
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
    const translations: Record<string, any> = {
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
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, questions");
  for (const quiz of quizzes ?? []) {
    const questions = quiz.questions as any[];
    const translatedQuestions = await Promise.all(
      questions.map(async (q: any) => {
        const translated: any = {
          ...q,
          question_ar: await translateText(q.question, "ar"),
          question_ur: await translateText(q.question, "ur"),
          question_fr: await translateText(q.question, "fr"),
          options_ar: await Promise.all(
            (q.options as string[]).map((o: string) => translateText(o, "ar"))
          ),
          options_ur: await Promise.all(
            (q.options as string[]).map((o: string) => translateText(o, "ur"))
          ),
          options_fr: await Promise.all(
            (q.options as string[]).map((o: string) => translateText(o, "fr"))
          ),
        };
        return translated;
      })
    );
    await supabase
      .from("quizzes")
      .update({ questions: translatedQuestions })
      .eq("id", quiz.id);
    console.log(`  ✓ Quiz ${quiz.id.slice(0, 8)}...`);
    await sleep(500);
  }

  console.log("\n✅ All content translated!");
}

main().catch(console.error);

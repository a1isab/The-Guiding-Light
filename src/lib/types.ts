export interface Profile {
  user_id: string;
  role: "student" | "admin";
  level: "beginner" | "intermediate" | "advanced";
  streak: number;
  onboarded: boolean;
  created_at: string;
}

export type Locale = "en" | "ar" | "ur" | "fr";

export type TranslationMap = Partial<Record<Locale, Record<string, string>>>;

export function getTranslation<T extends Record<string, any>>(
  obj: T,
  field: string,
  locale: Locale,
  fallback?: string
): string {
  const translations = (obj as any).translations as TranslationMap | undefined;
  if (translations && translations[locale] && translations[locale]![field]) {
    return translations[locale]![field]!;
  }
  return fallback ?? (obj as any)[field] ?? "";
}

export interface Course {
  id: string;
  title: string;
  title_ar: string | null;
  description: string;
  description_ar: string | null;
  translations: TranslationMap | null;
  level: "beginner" | "intermediate" | "advanced";
  slug: string;
  image_url: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  order_index: number;
  created_at: string;
}

export interface Section {
  id: string;
  course_id: string;
  title: string;
  title_ar: string | null;
  translations: TranslationMap | null;
  slug: string;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  title_ar: string | null;
  translations: TranslationMap | null;
  slug: string;
  content: string;
  content_type: "text" | "video" | "both";
  video_url: string | null;
  arabic_text: string | null;
  is_published: boolean;
  order_index: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: "free" | "premium";
  status: "active" | "cancelled" | "past_due";
  created_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_key: string;
  earned_at: string;
}

export interface SectionWithLessons extends Section {
  lessons: Lesson[];
}

export interface SimilarLesson {
  id: string;
  lesson_id: string;
  lesson_title: string;
  similarity: number;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  question_ar?: string;
  question_ur?: string;
  question_fr?: string;
  options_ar?: string[];
  options_ur?: string[];
  options_fr?: string[];
}

export function getQuizQuestion(q: QuizQuestion, locale: Locale): { question: string; options: string[] } {
  if (locale === "en") return { question: q.question, options: q.options };
  const key = locale as keyof Pick<QuizQuestion, "question_ar" | "question_ur" | "question_fr">;
  const optKey = `options_${locale}` as keyof QuizQuestion;
  const translatedQuestion = q[key] as string | undefined;
  const translatedOptions = q[optKey] as string[] | undefined;
  return {
    question: translatedQuestion || q.question,
    options: translatedOptions || q.options,
  };
}

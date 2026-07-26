export type Role = "student" | "teacher" | "admin";

export interface Profile {
  user_id: string;
  role: Role;
  level: "beginner" | "intermediate" | "advanced";
  streak: number;
  last_activity_at: string | null;
  onboarded: boolean;
  is_verified: boolean;
  display_name: string | null;
  onboarding_data: Record<string, unknown> | null;
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

export interface Subscription {
  id: string;
  user_id: string;
  plan: "free" | "premium";
  status: "active" | "cancelled" | "past_due";
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_key: string;
  earned_at: string;
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

export interface TeacherClass {
  id: string;
  teacher_id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  invite_code: string;
  invite_expires_at: string | null;
  created_at: string;
}

export interface ClassMember {
  id: string;
  class_id: string;
  student_id: string;
  joined_at: string;
}

export interface TeacherCourse {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  order_index: number;
  created_at: string;
}

export interface TeacherSection {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface TeacherLesson {
  id: string;
  section_id: string;
  title: string;
  content: string | null;
  quiz_source_content: string | null;
  video_url: string | null;
  duration: number | null;
  order_index: number;
  created_at: string;
}

export interface TeacherLessonTemplate {
  id: string;
  teacher_id: string | null;
  is_official: boolean;
  name: string;
  description: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TeacherVideoAsset {
  id: string;
  teacher_id: string;
  lesson_id: string | null;
  filename: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
}

export interface LessonComment {
  id: string;
  lesson_id: string;
  user_id: string;
  body: string;
  parent_id: string | null;
  created_at: string;
  profiles?: { user_id: string; role?: string };
}

export interface Assignment {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  max_score: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  body: string | null;
  status: "submitted" | "graded";
  score: number | null;
  feedback: string | null;
  file_urls: string[];
  submitted_at: string;
  graded_at: string | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  class_id: string;
  student_name: string;
  course_name: string;
  teacher_name: string | null;
  class_name: string | null;
  custom_title: string | null;
  custom_logo_url: string | null;
  earned_at: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  lesson_id: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  body: string;
  created_at: string;
}

export interface AnnouncementRead {
  id: string;
  announcement_id: string;
  student_id: string;
  read_at: string;
}

// Static locale-to-property-key mapping (avoids recreating on every function call)
const QUIZ_QUESTION_KEYS: Record<string, "question_ar" | "question_ur" | "question_fr"> = {
  ar: "question_ar",
  ur: "question_ur",
  fr: "question_fr",
};

export function getQuizQuestion(q: QuizQuestion, locale: Locale): { question: string; options: string[] } {
  if (locale === "en") return { question: q.question, options: q.options };

  // String interpolation for options works at runtime (e.g., "options_ar")
  // but for question we need an explicit map ("ar" ≠ "question_ar")
  const questionKey = QUIZ_QUESTION_KEYS[locale];
  const optionsKey = `options_${locale}` as keyof QuizQuestion;

  const translatedQuestion = questionKey ? (q as any)[questionKey] as string | undefined : undefined;
  const translatedOptions = (q as any)[optionsKey] as string[] | undefined;

  return {
    question: translatedQuestion || q.question,
    options: translatedOptions || q.options,
  };
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  document_type: "passport" | "national_id" | "teaching_certificate" | "other";
  document_url: string;
  document_number: string | null;
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  review_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

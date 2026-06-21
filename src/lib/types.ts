export interface Profile {
  user_id: string;
  role: "student" | "admin";
  level: "beginner" | "intermediate" | "advanced";
  streak: number;
  onboarded: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  title_ar: string | null;
  description: string;
  description_ar: string | null;
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
  slug: string;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  title_ar: string | null;
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
}

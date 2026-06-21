import { createServiceClient } from "@/lib/supabase-server";
import { CourseList } from "@/components/course-list";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabase = createServiceClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("order_index", { ascending: true });

  const { data: lessonRows } = await supabase
    .from("lessons")
    .select("section_id, sections!inner(course_id)");

  const courseLessonCount: Record<string, number> = {};
  for (const row of lessonRows ?? []) {
    const cid = (row as any).sections.course_id;
    courseLessonCount[cid] = (courseLessonCount[cid] ?? 0) + 1;
  }

  const { data: videoCourses } = await supabase
    .from("lessons")
    .select("section_id, sections!inner(course_id)")
    .not("video_url", "is", null);

  const courseHasVideo = new Set(
    videoCourses?.map((l: any) => l.sections.course_id) ?? []
  );

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-500">No courses available yet.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="font-amiri text-4xl font-bold text-zinc-100">All Courses</h1>
        <p className="mt-2 text-zinc-400">Start anywhere. Learn at your own pace.</p>
      </div>

      <CourseList
        courses={courses}
        courseLessonCount={courseLessonCount}
        courseHasVideo={courseHasVideo}
      />
    </div>
  );
}

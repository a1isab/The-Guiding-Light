import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher } from "@/lib/supabase-api";
import { createClient } from "@supabase/supabase-js";

const MAGIC_BYTES: Record<string, Uint8Array[]> = {
  "application/pdf": [new Uint8Array([0x25, 0x50, 0x44, 0x46])],
  "application/msword": [new Uint8Array([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    new Uint8Array([0x50, 0x4B, 0x03, 0x04]),
    new Uint8Array([0x50, 0x4B, 0x05, 0x06]),
    new Uint8Array([0x50, 0x4B, 0x07, 0x08]),
  ],
};

const ALLOWED_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ALLOWED_EXTS = ["pdf", "doc", "docx", "txt"];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function startsWithAny(buf: Uint8Array, signatures: Uint8Array[]): boolean {
  return signatures.some((sig) => {
    if (buf.length < sig.length) return false;
    return sig.every((byte, i) => buf[i] === byte);
  });
}

function validateFileContent(buffer: ArrayBuffer, mimeType: string): boolean {
  if (mimeType === "text/plain") return true;
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;
  const buf = new Uint8Array(buffer);
  return startsWithAny(buf, signatures);
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const teacherId = await requireTeacher(supabase);
  if (!teacherId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const lessonId = formData.get("lessonId") as string | null;

  if (!file || !lessonId) {
    return NextResponse.json({ error: "file and lessonId required" }, { status: 400 });
  }

  if (!ALLOWED_MIMES.includes(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed. Accepted: PDF, Word (doc/docx), TXT" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTS.includes(ext)) {
    return NextResponse.json({ error: "File extension not allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();

  if (!validateFileContent(buffer, file.type)) {
    return NextResponse.json({ error: "File content does not match declared type" }, { status: 400 });
  }

  // Verify teacher owns the lesson's class
  const lesson = (await supabase
    .from("teacher_lessons")
    .select("section_id")
    .eq("id", lessonId)
    .single()).data as { section_id: string } | null;

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const section = (await supabase
    .from("teacher_sections")
    .select("course_id")
    .eq("id", lesson.section_id)
    .single()).data as { course_id: string } | null;

  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  const course = (await supabase
    .from("teacher_courses")
    .select("class_id")
    .eq("id", section.course_id)
    .single()).data as { class_id: string } | null;

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", course.class_id)
    .single()).data as { teacher_id: string } | null;

  if (!cls || cls.teacher_id !== teacherId) {
    const { data: role } = await supabase.rpc("get_user_role");
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const storagePath = `${teacherId}/${lessonId}/${crypto.randomUUID()}.${ext}`;

  const storage = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: uploadError } = await storage.storage
    .from("lesson-files")
    .upload(storagePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Insert DB record
  const { data, error: dbError } = await supabase
    .from("teacher_lesson_files")
    .insert({
      lesson_id: lessonId,
      teacher_id: teacherId,
      filename: file.name,
      mime_type: file.type,
      storage_path: storagePath,
      file_size: file.size,
    })
    .select("id, filename, mime_type, file_size, created_at")
    .single();

  if (dbError) {
    await storage.storage.from("lesson-files").remove([storagePath]);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const { data: urlData } = storage.storage.from("lesson-files").getPublicUrl(storagePath);

  return applyCookies(
    NextResponse.json({ file: { ...data, public_url: urlData.publicUrl } })
  );
}

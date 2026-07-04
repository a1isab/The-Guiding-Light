import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth } from "@/lib/supabase-api";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAuth(supabase);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const { data: files, error } = await supabase
    .from("teacher_lesson_files")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ files: files ?? [] }));
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAuth(supabase);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, filename, mime_type, file_size, storage_path } = await request.json();
  if (!lessonId || !filename || !storage_path) {
    return NextResponse.json({ error: "lessonId, filename, and storage_path required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("teacher_lesson_files")
    .insert({
      lesson_id: lessonId,
      teacher_id: userId,
      filename,
      mime_type: mime_type ?? "application/octet-stream",
      file_size: file_size ?? 0,
      storage_path,
    })
    .select("id, filename, mime_type, file_size, storage_path, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const storage = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: urlData } = storage.storage.from("lesson-files").getPublicUrl(storage_path);

  return applyCookies(
    NextResponse.json({ file: { ...data, public_url: urlData.publicUrl } })
  );
}

export async function DELETE(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAuth(supabase);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  // Get file record to verify ownership and get storage path
  const { data: file, error: fetchError } = await supabase
    .from("teacher_lesson_files")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const { data: role } = await supabase.rpc("get_user_role");
  const isOwner = file.teacher_id === userId;
  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Delete from storage
  const storage = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: storageError } = await storage.storage
    .from("lesson-files")
    .remove([file.storage_path]);

  if (storageError) {
    console.error("Storage delete error:", storageError);
  }

  // Delete from DB
  const { error: deleteError } = await supabase
    .from("teacher_lesson_files")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ ok: true }));
}

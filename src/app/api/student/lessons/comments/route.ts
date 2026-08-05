import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken } from "@/lib/supabase-api";
import { createAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");
  if (!lessonId) return applyCookies(NextResponse.json({ error: "lessonId required" }, { status: 400 }));

  const admin = createAdminClient() ?? supabase;

  const { data: comments, error } = await admin
    .from("lesson_comments")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: true });

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));

  const userIds = [...new Set((comments ?? []).map((c) => c.user_id))];
  const profiles: Record<string, { user_id: string; role: string }> = {};

  if (userIds.length > 0) {
    const { data: profilesData } = await admin
      .from("profiles")
      .select("user_id, role")
      .in("user_id", userIds);

    if (profilesData) {
      for (const p of profilesData) {
        profiles[p.user_id] = p;
      }
    }
  }

  const enriched = (comments ?? []).map((c) => ({
    ...c,
    author_name: profiles[c.user_id]?.role === "teacher" ? "Teacher" : "Student",
    author_role: profiles[c.user_id]?.role ?? "student",
    is_owner: c.user_id === userId,
  }));

  return applyCookies(NextResponse.json({ comments: enriched }));
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { lessonId, body, parentId } = await request.json();
  if (!lessonId || !body?.trim()) {
    return applyCookies(NextResponse.json({ error: "lessonId and body required" }, { status: 400 }));
  }

  if (parentId) {
    const { data: parent } = await supabase
      .from("lesson_comments")
      .select("id, parent_id")
      .eq("id", parentId)
      .single();

    if (!parent) return applyCookies(NextResponse.json({ error: "Parent comment not found" }, { status: 404 }));
    if (parent.parent_id) {
      return applyCookies(NextResponse.json({ error: "Cannot reply to a reply" }, { status: 400 }));
    }
  }

  const { data, error } = await supabase
    .from("lesson_comments")
    .insert({
      lesson_id: lessonId,
      user_id: userId,
      body: body.trim(),
      parent_id: parentId ?? null,
    })
    .select("id")
    .single();

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ id: (data as { id: string }).id }));
}

export async function DELETE(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("id");
  if (!commentId) return applyCookies(NextResponse.json({ error: "id required" }, { status: 400 }));

  const { data: comment } = await supabase
    .from("lesson_comments")
    .select("id, user_id")
    .eq("id", commentId)
    .single();

  if (!comment) return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));

  if (comment.user_id !== userId) {
    const { getUserRole } = await import("@/lib/supabase-api");
    const role = await getUserRole(supabase);
    if (!role?.includes("teacher") && !role?.includes("admin")) {
      return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
    }
  }

  const { error } = await supabase.from("lesson_comments").delete().eq("id", commentId);
  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ ok: true }));
}

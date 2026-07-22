import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken } from "@/lib/supabase-api";
import { createAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  if (!classId) return applyCookies(NextResponse.json({ error: "classId required" }, { status: 400 }));

  const admin = createAdminClient() ?? supabase;

  const { data: announcements, error } = await admin
    .from("announcements")
    .select("*")
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));

  const announcementIds = (announcements ?? []).map((a) => a.id);
  let readIds: Set<string> = new Set();

  if (announcementIds.length > 0) {
    const { data: reads } = await admin
      .from("announcement_reads")
      .select("announcement_id")
      .eq("student_id", userId)
      .in("announcement_id", announcementIds);

    readIds = new Set((reads ?? []).map((r) => r.announcement_id));
  }

  const enriched = (announcements ?? []).map((a) => ({
    ...a,
    is_read: readIds.has(a.id),
  }));

  return applyCookies(NextResponse.json({ announcements: enriched }));
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { announcementIds } = await request.json();
  if (!Array.isArray(announcementIds) || announcementIds.length === 0) {
    return applyCookies(NextResponse.json({ error: "announcementIds array required" }, { status: 400 }));
  }

  const inserts = announcementIds.map((aid: string) => ({
    announcement_id: aid,
    student_id: userId,
  }));

  const { error } = await supabase.from("announcement_reads").upsert(inserts, {
    onConflict: "announcement_id,student_id",
    ignoreDuplicates: true,
  });

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ ok: true }));
}

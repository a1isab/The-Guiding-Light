import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken, retryQuery } from "@/lib/supabase-api";

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const assignmentId = searchParams.get("assignmentId");
  if (!assignmentId) return applyCookies(NextResponse.json({ error: "assignmentId required" }, { status: 400 }));

  const { data, error } = await retryQuery(() =>
    supabase
      .from("submissions")
      .select("*")
      .eq("assignment_id", assignmentId)
      .eq("student_id", userId)
      .single(),
  );

  if (error && error.code !== "PGRST116") {
    return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  }

  return applyCookies(NextResponse.json({ submission: data ?? null }));
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { assignmentId, body, fileUrls } = await request.json();
  if (!assignmentId) {
    return applyCookies(NextResponse.json({ error: "assignmentId required" }, { status: 400 }));
  }

  const { data: existing } = await retryQuery(() =>
    supabase
      .from("submissions")
      .select("id, status")
      .eq("assignment_id", assignmentId)
      .eq("student_id", userId)
      .single(),
  );

  const existingRow = existing as { id: string; status: string } | null;

  if (existingRow && existingRow.status === "graded") {
    return applyCookies(NextResponse.json({ error: "Submission already graded" }, { status: 400 }));
  }

  if (existingRow) {
    const { error } = await retryQuery(() =>
      supabase
        .from("submissions")
        .update({ body: body ?? null, file_urls: fileUrls ?? [] })
        .eq("id", existingRow.id),
    );

    if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
    return applyCookies(NextResponse.json({ id: existingRow.id }));
  }

  const { data, error } = await retryQuery(() =>
    supabase
      .from("submissions")
      .insert({
        assignment_id: assignmentId,
        student_id: userId,
        body: body ?? null,
        file_urls: fileUrls ?? [],
      })
      .select("id")
      .single(),
  );

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ id: (data as { id: string }).id }));
}

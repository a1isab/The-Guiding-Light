import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher, extractBearerToken, withErrorHandling } from "@/lib/supabase-api";
import { createAdminClient } from "@/lib/supabase";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireTeacher(supabase, jwt);
  if (!userId) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const dataClient = createAdminClient();
  if (!dataClient) {
    return applyCookies(NextResponse.json({ error: "Server misconfigured" }, { status: 500 }));
  }

  const { data, error } = await dataClient
    .from("teacher_verification_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  }

  if (!data) {
    return applyCookies(NextResponse.json({ status: "none" }));
  }

  return applyCookies(NextResponse.json(data));
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireTeacher(supabase, jwt);
  if (!userId) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const dataClient = createAdminClient();
  if (!dataClient) {
    return applyCookies(NextResponse.json({ error: "Server misconfigured" }, { status: 500 }));
  }

  const { document_type, document_url, document_number, notes } = await request.json();
  if (!document_type || !document_url) {
    return applyCookies(NextResponse.json({ error: "document_type and document_url are required" }, { status: 400 }));
  }

  const { data: existing } = await dataClient
    .from("teacher_verification_requests")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "pending")
    .limit(1)
    .maybeSingle();

  if (existing) {
    return applyCookies(NextResponse.json({ error: "A pending verification request already exists" }, { status: 409 }));
  }

  const { data, error } = await dataClient
    .from("teacher_verification_requests")
    .insert({
      user_id: userId,
      document_type,
      document_url,
      document_number: document_number ?? null,
      notes: notes ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  }

  return applyCookies(NextResponse.json(data));
});

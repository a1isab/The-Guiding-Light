import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAdmin, withErrorHandling } from "@/lib/supabase-api";
import { createAdminClient } from "@/lib/supabase";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAdmin(supabase);
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
    .order("created_at", { ascending: true });

  if (error) {
    return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  }

  return applyCookies(NextResponse.json({ requests: data ?? [] }));
});

export const PATCH = withErrorHandling(async (request: NextRequest) => {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAdmin(supabase);
  if (!userId) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const dataClient = createAdminClient();
  if (!dataClient) {
    return applyCookies(NextResponse.json({ error: "Server misconfigured" }, { status: 500 }));
  }

  const { id, action, review_notes } = await request.json();
  if (!id || !action) {
    return applyCookies(NextResponse.json({ error: "id and action are required" }, { status: 400 }));
  }
  if (action !== "approve" && action !== "reject") {
    return applyCookies(NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 }));
  }

  const { data: req, error: fetchError } = await dataClient
    .from("teacher_verification_requests")
    .select("user_id, status")
    .eq("id", id)
    .single();

  if (fetchError || !req) {
    return applyCookies(NextResponse.json({ error: "Request not found" }, { status: 404 }));
  }
  if (req.status !== "pending") {
    return applyCookies(NextResponse.json({ error: "Request is not pending" }, { status: 409 }));
  }

  const updates: Record<string, unknown> = {
    status: action === "approve" ? "approved" : "rejected",
    reviewed_by: userId,
    reviewed_at: new Date().toISOString(),
  };
  if (action === "reject" && review_notes) {
    updates.review_notes = review_notes;
  }

  const { error: updateError } = await dataClient
    .from("teacher_verification_requests")
    .update(updates)
    .eq("id", id);

  if (updateError) {
    return applyCookies(NextResponse.json({ error: updateError.message }, { status: 500 }));
  }

  if (action === "approve") {
    const { error: profileError } = await dataClient
      .from("profiles")
      .update({ is_verified: true })
      .eq("user_id", req.user_id);

    if (profileError) {
      return applyCookies(NextResponse.json({ error: profileError.message }, { status: 500 }));
    }
  }

  return applyCookies(NextResponse.json({ ok: true }));
});

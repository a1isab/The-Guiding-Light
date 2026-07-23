import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth } from "@/lib/supabase-api";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(req);
  const userId = await requireAuth(supabase);

  if (!userId) {
    return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const body = await req.json();
  const { displayName, level, interests, goals, subjects, experience } = body;

  if (!displayName || typeof displayName !== "string" || displayName.trim().length === 0) {
    return applyCookies(NextResponse.json({ error: "Display name is required" }, { status: 400 }));
  }

  // Use admin client for profile read/update to bypass RLS
  const admin = createAdminClient();

  // Check if already onboarded
  const { data: profile } = admin
    ? await admin
        .from("profiles")
        .select("onboarded")
        .eq("user_id", userId)
        .single()
    : await supabase
        .from("profiles")
        .select("onboarded")
        .eq("user_id", userId)
        .single();

  if (profile?.onboarded) {
    return applyCookies(NextResponse.json({ success: true, message: "Already onboarded" }));
  }

  // Build onboarding data
  const onboardingData: Record<string, unknown> = {};
  if (level) onboardingData.level = level;
  if (interests) onboardingData.interests = interests;
  if (goals) onboardingData.goals = goals;
  if (subjects) onboardingData.subjects = subjects;
  if (experience) onboardingData.experience = experience;

  // Try full update with display_name + onboarding_data columns (migration 023)
  // Fall back to just onboarded if columns don't exist
  const db = admin ?? supabase;
  const { error } = await db
    .from("profiles")
    .update({
      display_name: displayName.trim(),
      onboarding_data: onboardingData,
      onboarded: true,
    })
    .eq("user_id", userId);

  if (error) {
    // If display_name column doesn't exist, fall back to just setting onboarded
    if (error.code === "PGRST204" || error.message?.includes("column")) {
      const { error: fallbackError } = await db
        .from("profiles")
        .update({ onboarded: true })
        .eq("user_id", userId);
      if (fallbackError) {
        console.error("Onboarding fallback error:", fallbackError);
        return applyCookies(NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 }));
      }
      return applyCookies(NextResponse.json({ success: true }));
    }
    console.error("Onboarding update error:", error);
    return applyCookies(NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 }));
  }

  return applyCookies(NextResponse.json({ success: true }));
}

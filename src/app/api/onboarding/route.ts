import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth } from "@/lib/supabase-api";

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

  // Check if already onboarded
  const { data: profile } = await supabase
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

  // Update profile
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName.trim(),
      onboarding_data: onboardingData,
      onboarded: true,
    })
    .eq("user_id", userId);

  if (error) {
    console.error("Onboarding update error:", error);
    return applyCookies(NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 }));
  }

  return applyCookies(NextResponse.json({ success: true }));
}

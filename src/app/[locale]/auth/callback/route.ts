import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient } from "@/lib/supabase-api";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const pathParts = url.pathname.split("/").filter(Boolean);
  const locale = pathParts.length > 0 && /^[a-z]{2}(-[A-Z]{2})?$/.test(pathParts[0]) ? pathParts[0] : "en";
  const next = searchParams.get("next") ?? `/${locale}/courses`;

  if (type === "recovery") {
    const { supabase, applyCookies } = createApiSupabaseClient(request);

    if (token_hash) {
      const { error } = await supabase.auth.verifyOtp({
        type: "recovery",
        token_hash,
      });
      if (!error) {
        return applyCookies(NextResponse.redirect(new URL(`/${locale}/auth/reset-password`, request.url)));
      }
    }

    return applyCookies(NextResponse.redirect(new URL(`/${locale}/auth/login?error=Invalid+or+expired+link`, request.url)));
  }

  if (token_hash && type) {
    const { supabase, applyCookies } = createApiSupabaseClient(request);

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return applyCookies(NextResponse.redirect(new URL(next, request.url)));
    }
  }

  return NextResponse.redirect(new URL(`/${locale}/auth/login?error=Invalid+or+expired+link`, request.url));
}

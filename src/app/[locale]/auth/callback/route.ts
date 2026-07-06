import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const pathParts = url.pathname.split("/").filter(Boolean);
  const locale = pathParts.length > 0 && /^[a-z]{2}(-[A-Z]{2})?$/.test(pathParts[0]) ? pathParts[0] : "en";
  const next = searchParams.get("next") ?? `/${locale}/courses`;

  if (type === "recovery") {
    // Password recovery flow — verify OTP and redirect to reset-password page
    let supabaseResponse = NextResponse.redirect(new URL(`/${locale}/auth/reset-password`, request.url));

    const supabase = createSSRClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    if (token_hash) {
      const { error } = await supabase.auth.verifyOtp({
        type: "recovery",
        token_hash,
      });
      if (!error) return supabaseResponse;
    }

    return NextResponse.redirect(new URL(`/${locale}/auth/login?error=Invalid+or+expired+link`, request.url));
  }

  if (token_hash && type) {
    let supabaseResponse = NextResponse.redirect(new URL(next, request.url));

    const supabase = createSSRClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return supabaseResponse;
    }
  }

  return NextResponse.redirect(new URL(`/${locale}/auth/login?error=Invalid+or+expired+link`, request.url));
}

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";

function getLocale(url: URL): string {
  const pathParts = url.pathname.split("/").filter(Boolean);
  return pathParts.length > 0 && /^[a-z]{2}(-[A-Z]{2})?$/.test(pathParts[0]) ? pathParts[0] : "en";
}

function createSupabase(request: NextRequest, response: NextResponse) {
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieEncoding: "base64url",
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, {
              ...options,
              path: "/",
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            });
          });
        },
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const locale = getLocale(url);
  const origin = url.origin;
  const response = NextResponse.redirect(new URL(`/${locale}`, origin));

  const supabase = createSupabase(request, response);
  await supabase.auth.signOut();

  return response;
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const locale = getLocale(url);
  const origin = url.origin;
  const supabaseResponse = NextResponse.redirect(new URL(`/${locale}`, origin));

  const supabase = createSupabase(request, supabaseResponse);
  await supabase.auth.signOut();

  return supabaseResponse;
}

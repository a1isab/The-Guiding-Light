import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const code = searchParams.get("code");
  const pathParts = url.pathname.split("/").filter(Boolean);
  const locale = pathParts.length > 0 && /^[a-z]{2}(-[A-Z]{2})?$/.test(pathParts[0]) ? pathParts[0] : "en";
  const next = searchParams.get("next") ?? `/${locale}/dashboard`;

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set({ name, value });
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(new URL(next, request.url));
      for (const cookie of request.cookies.getAll()) {
        response.cookies.set(cookie.name, cookie.value);
      }
      return response;
    }
  }

  return NextResponse.redirect(new URL(`/${locale}/auth/login?error=Invalid+or+expired+link`, request.url));
}

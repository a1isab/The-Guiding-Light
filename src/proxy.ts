import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { routing } from "../i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const protectedPaths = ["/dashboard", "/courses/"];
const LOCALES = new Set<string>(routing.locales);

function stripLocale(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean);
  if (seg.length > 0 && LOCALES.has(seg[0])) {
    return "/" + seg.slice(1).join("/");
  }
  return pathname;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Run next-intl middleware for locale handling
  const intlResponse = await intlMiddleware(request);

  // If next-intl wants to redirect (add locale prefix), do that
  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  // 2. Extract locale from the response
  const locale: string = intlResponse.headers.get("X-NEXT-INTL-LOCALE") || routing.defaultLocale;

  // 3. Run auth check on the locale-stripped path
  const actualPath = stripLocale(pathname);
  const isProtected = protectedPaths.some((p) => actualPath.startsWith(p));

  if (isProtected) {
    let supabaseResponse = NextResponse.next({ request });

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/" + locale + "/auth/login";
      url.searchParams.set("redirect", actualPath);
      return NextResponse.redirect(url);
    }

    supabaseResponse.headers.set("X-NEXT-INTL-LOCALE", locale);
    return supabaseResponse;
  }

  // 4. Non-protected path — just forward locale header
  intlResponse.headers.set("X-NEXT-INTL-LOCALE", locale);
  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

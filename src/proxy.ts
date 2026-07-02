import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { routing } from "../i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const protectedPaths = ["/dashboard"];
const adminPaths = ["/admin", "/teacher"];
const apiAdminPaths = ["/api/admin"];
const joinPaths = ["/join"];
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

  const intlResponse = await intlMiddleware(request);
  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const locale: string = intlResponse.headers.get("X-NEXT-INTL-LOCALE") || routing.defaultLocale;

  const actualPath = stripLocale(pathname);
  const isProtected = protectedPaths.some((p) => actualPath.startsWith(p));
  const isAdmin = adminPaths.some((p) => actualPath.startsWith(p));
  const isApiAdmin = apiAdminPaths.some((p) => pathname.startsWith(p));
  const isJoin = joinPaths.some((p) => actualPath.startsWith(p));

  if (isProtected || isAdmin || isApiAdmin || isJoin) {
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

    if (isAdmin || isApiAdmin) {
      const { data: role } = await supabase.rpc("get_user_role");

      if (role !== "admin" && role !== "teacher") {
        if (isApiAdmin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
      }
    }

    supabaseResponse.headers.set("X-NEXT-INTL-LOCALE", locale);
    return supabaseResponse;
  }

  intlResponse.headers.set("X-NEXT-INTL-LOCALE", locale);
  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

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

  // ─── API routes: skip intl middleware to avoid locale prefix redirect ───
  if (pathname.startsWith("/api/")) {
    if (apiAdminPaths.some((p) => pathname.startsWith(p))) {
      let supabaseResponse = NextResponse.next({ request });

      const supabase = createSSRClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return request.cookies.getAll(); },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
              supabaseResponse = NextResponse.next({ request });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { data: role } = await supabase.rpc("get_user_roles");
      if (!role?.includes("admin") && !role?.includes("teacher")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return supabaseResponse;
    }

    return NextResponse.next();
  }

  // ─── Non-API routes: intl + auth middleware ───
  const intlResponse = await intlMiddleware(request);
  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const locale: string = intlResponse.headers.get("X-NEXT-INTL-LOCALE") || routing.defaultLocale;

  const actualPath = stripLocale(pathname);
  const isProtected = protectedPaths.some((p) => actualPath.startsWith(p));
  const isAdmin = adminPaths.some((p) => actualPath.startsWith(p));
  const isJoin = joinPaths.some((p) => actualPath.startsWith(p));

  if (isProtected || isAdmin || isJoin) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createSSRClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/" + locale + "/auth/login";
      url.searchParams.set("redirect", actualPath);
      const redirectRes = NextResponse.redirect(url);
      redirectRes.headers.set("x-debug", "no-user");
      return redirectRes;
    }

    const { data: role } = await supabase.rpc("get_user_roles");

    if (isAdmin) {
      if (!role?.includes("admin") && !role?.includes("teacher")) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
      }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-debug-user", user.id);
    if (role) {
      requestHeaders.set("x-user-roles", JSON.stringify(role));
    }
    supabaseResponse = NextResponse.next({
      request: { headers: requestHeaders },
    });

    supabaseResponse.headers.set("X-NEXT-INTL-LOCALE", locale);
    supabaseResponse.headers.set("x-debug", "user:" + user.id);
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

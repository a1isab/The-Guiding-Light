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

      const allCookies = request.cookies.getAll();
      const cookieNames = allCookies.map((c) => c.name);
      const authCookies = allCookies.filter((c) => c.name.includes("auth-token"));

      redirectRes.headers.set("x-debug-cookie-names", cookieNames.join(", ") || "(none)");

      if (authCookies.length > 0) {
        const authInfo = authCookies
          .map(
            (c) =>
              `${c.name}: prefix=${c.value.startsWith("base64-")}, len=${c.value.length}`,
          )
          .join(" | ");
        redirectRes.headers.set("x-debug-auth-cookies", authInfo);
      } else {
        redirectRes.headers.set("x-debug-auth-cookies", "NONE");
      }
      return redirectRes;
    }

    const { data: role } = await supabase.rpc("get_user_roles");

    if (isAdmin) {
      if (!role?.includes("admin") && !role?.includes("teacher")) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
      }
    }

    // Set user info as response cookies (NOT request headers) so we NEVER
    // overwrite supabaseResponse and lose the auth cookies that setAll() wrote.
    // Server Components read these via the cookies() API.
    const cookieMaxAge = 60 * 60; // 1 hour
    supabaseResponse.cookies.set("x-user-id", user.id, {
      path: "/",
      maxAge: cookieMaxAge,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    supabaseResponse.cookies.set("x-debug", "user:" + user.id, {
      path: "/",
      maxAge: cookieMaxAge,
      httpOnly: false,
    });
    if (role) {
      supabaseResponse.cookies.set("x-user-roles", JSON.stringify(role), {
        path: "/",
        maxAge: cookieMaxAge,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    // Debug: log cookie names present in the request
    const allCookieNames = request.cookies.getAll().map((c) => c.name).join(",");
    supabaseResponse.cookies.set("x-debug-cookies", allCookieNames, {
      path: "/",
      maxAge: 60,
      httpOnly: false,
    });

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

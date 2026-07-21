import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { getUserRole } from "@/lib/supabase-api";
import { routing } from "../i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const PROTECTED_PATHS = ["/dashboard", "/teacher", "/admin"];

export async function proxy(request: NextRequest) {
  console.log(`[DEBUG] Middleware processing: ${request.nextUrl.pathname}, Cookies: ${request.cookies.getAll().map(c => c.name).join(', ')}`);
  const pathname = request.nextUrl.pathname;

  // ─── Intl middleware first ───
  const intlResponse = await intlMiddleware(request);
  if (intlResponse.headers.get("location")) return intlResponse;

  const locale: string = intlResponse.headers.get("X-NEXT-INTL-LOCALE") || routing.defaultLocale;

  // ─── Mutable response for cookie chaining ───
  // Must be a fresh NextResponse.next() so setAll can reassign it safely
  // when Supabase refreshes the session token. Returning the same live
  // variable at the end ensures refreshed cookies reach the browser.
  let response = NextResponse.next({
    request: { headers: request.headers },
  });
  response.headers.set("X-NEXT-INTL-LOCALE", locale);

  // ─── Auth header propagation for protected routes ───
  const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");
  const isProtected = PROTECTED_PATHS.some((p) => pathWithoutLocale.startsWith(p));

  if (isProtected) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieEncoding: "base64url",
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
            });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.headers.set("X-NEXT-INTL-LOCALE", locale);
            cookiesToSet.forEach(({ name, value, options }) => {
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

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.log(`[DEBUG] Middleware: getSession error:`, sessionError.message);
    }
    if (session?.user) {
      response.headers.set("x-user-id", session.user.id);
      console.log(`[DEBUG] Middleware: Session found for user ${session.user.id}`);

      const now = Math.floor(Date.now() / 1000);
      const isExpired = !!session.expires_at && session.expires_at < now;
      if (!isExpired) {
        const roles = await getUserRole(supabase);
        if (roles && roles.length > 0) {
          response.headers.set("x-user-roles", JSON.stringify(roles));
        }
      }
    } else {
        console.log(`[DEBUG] Middleware: No session found for path ${pathname}`);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
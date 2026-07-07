import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "../i18n/routing";
import { getUserRole } from "@/lib/supabase-api";

const intlMiddleware = createIntlMiddleware(routing);
const PROTECTED_PATHS = ["/dashboard", "/teacher", "/admin"];

async function refreshCookies(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const roles = await getUserRole(supabase);
    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-roles", JSON.stringify(roles ?? []));
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ─── API routes: just refresh cookies, skip intl ───
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    await refreshCookies(request, response);
    return response;
  }

  // ─── Intl middleware for all other routes ───
  const intlResponse = await intlMiddleware(request);
  if (intlResponse.headers.get("location")) return intlResponse;

  const locale: string = intlResponse.headers.get("X-NEXT-INTL-LOCALE") || routing.defaultLocale;
  intlResponse.headers.set("X-NEXT-INTL-LOCALE", locale);

  // ─── Auth header propagation for protected routes ───
  const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");
  const isProtected = PROTECTED_PATHS.some((p) => pathWithoutLocale.startsWith(p));

  if (isProtected) {
    await refreshCookies(request, intlResponse);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

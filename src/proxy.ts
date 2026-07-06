import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "../i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const PROTECTED_PATHS = ["/dashboard", "/teacher", "/admin"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ─── API routes: skip intl middleware to avoid locale prefix redirect ───
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // ─── Intl middleware first ───
  const intlResponse = await intlMiddleware(request);
  if (intlResponse.headers.get("location")) return intlResponse;

  const locale: string = intlResponse.headers.get("X-NEXT-INTL-LOCALE") || routing.defaultLocale;
  intlResponse.headers.set("X-NEXT-INTL-LOCALE", locale);

  // ─── Auth header propagation for protected routes ───
  // Middleware can set cookies during token refresh; Server Components cannot.
  // We call getUser() here and pass the result via headers.
  const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");
  const isProtected = PROTECTED_PATHS.some((p) => pathWithoutLocale.startsWith(p));

  if (isProtected) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              intlResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roles } = await supabase.rpc("get_user_roles");
      intlResponse.headers.set("x-user-id", user.id);
      intlResponse.headers.set("x-user-roles", JSON.stringify(roles ?? []));
    }
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

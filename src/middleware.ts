import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "../i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const PROTECTED_PATHS = ["/dashboard", "/teacher", "/admin"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ─── Intl middleware first ───
  const intlResponse = await intlMiddleware(request);
  if (intlResponse.headers.get("location")) return intlResponse;

  const locale: string = intlResponse.headers.get("X-NEXT-INTL-LOCALE") || routing.defaultLocale;
  intlResponse.headers.set("X-NEXT-INTL-LOCALE", locale);

  // ─── Auth header propagation for protected routes ───
  // Middleware refreshes the session and writes cookies to the response.
  // Server Components read the headers instead of calling getUser()
  // themselves (Next.js 16 does not allow cookie writes during render).
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
              request.cookies.set(name, value);
              intlResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      intlResponse.headers.set("x-user-id", session.user.id);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

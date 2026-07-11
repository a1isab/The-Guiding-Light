import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { getUserRole } from "@/lib/supabase-api";
import { routing } from "../i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const PROTECTED_PATHS = ["/dashboard", "/teacher", "/admin"];

export async function middleware(request: NextRequest) {
  console.log(`[DEBUG] Middleware processing: ${request.nextUrl.pathname}, Cookies: ${request.cookies.getAll().map(c => c.name).join(', ')}`);
  const pathname = request.nextUrl.pathname;

  // ─── Intl middleware first ───
  const intlResponse = await intlMiddleware(request);
  if (intlResponse.headers.get("location")) return intlResponse;

  const locale: string = intlResponse.headers.get("X-NEXT-INTL-LOCALE") || routing.defaultLocale;
  intlResponse.headers.set("X-NEXT-INTL-LOCALE", locale);

  // ─── Auth header propagation for protected routes ───
  // Uses getSession() (no network, reads cookie) then resolves roles via
  // a single RPC call only when the session is not expired.
  // Server Components and API routes handle token refresh on fallback.
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
      console.log(`[DEBUG] Middleware: Session found for user ${session.user.id}`);

      // Resolve roles only when token is fresh (avoids failed RPC with expired token).
      // SCs fall back to getUser() + getUserRole() when headers are absent.
      const now = Math.floor(Date.now() / 1000);
      const isExpired = !!session.expires_at && session.expires_at < now;
      if (!isExpired) {
        const roles = await getUserRole(supabase);
        if (roles && roles.length > 0) {
          intlResponse.headers.set("x-user-roles", JSON.stringify(roles));
        }
      }
    } else {
        console.log(`[DEBUG] Middleware: No session found for path ${pathname}`);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

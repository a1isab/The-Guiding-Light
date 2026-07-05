import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ─── API routes: skip intl middleware to avoid locale prefix redirect ───
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // ─── Non-API routes: intl middleware only (no auth) ───
  // Auth is handled by each Server Component via createServerSupabaseClient()
  const intlResponse = await intlMiddleware(request);
  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const locale: string = intlResponse.headers.get("X-NEXT-INTL-LOCALE") || routing.defaultLocale;
  intlResponse.headers.set("X-NEXT-INTL-LOCALE", locale);
  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const intlResponse = await intlMiddleware(request);
  if (intlResponse.headers.get("location")) return intlResponse;

  const locale: string = intlResponse.headers.get("X-NEXT-INTL-LOCALE") || routing.defaultLocale;
  intlResponse.headers.set("X-NEXT-INTL-LOCALE", locale);

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

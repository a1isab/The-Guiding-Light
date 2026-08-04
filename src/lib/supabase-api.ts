import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export function extractBearerToken(request: NextRequest): string | undefined {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
}

/**
 * Collects cookies set by Supabase SSR during an API request and applies
 * them to the outgoing response. This avoids the fragile mutableResponse
 * reassignment pattern that was previously used.
 */
class CookieCollector {
  private cookies: { name: string; value: string; options?: Record<string, unknown> }[] = [];

  getAll() {
    return [...this.cookies];
  }

  set(name: string, value: string, options?: Record<string, unknown>) {
    this.cookies.push({ name, value, options });
  }

  applyTo(response: NextResponse): NextResponse {
    for (const cookie of this.cookies) {
      response.cookies.set(cookie.name, cookie.value, {
        ...(cookie.options as any),
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
    return response;
  }
}

export function createApiSupabaseClient(request: NextRequest) {
  const collector = new CookieCollector();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieEncoding: "base64url",
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            collector.set(name, value, options);
          });
        },
      },
    },
  );

  function applyCookies(response: NextResponse): NextResponse {
    return collector.applyTo(response);
  }

  return { supabase, applyCookies };
}

export type ApiSupabase = ReturnType<typeof createApiSupabaseClient>;

function isTransientError(error: any): boolean {
  const code = error?.code ?? "";
  return code === "57014" || code === "53300" || code.startsWith("08");
}

/**
 * Retries a Supabase query when the hosted free tier hits transient
 * connection/statement timeouts (e.g. 57014 on a cold pool). The retry
 * typically succeeds once the connection is warm.
 */
export async function retryQuery(
  build: () => any,
  attempts = 3,
): Promise<{ data: any; error: any }> {
  let lastError: any;
  for (let i = 0; i < attempts; i++) {
    const result = await build();
    if (!result.error || !isTransientError(result.error)) return result;
    lastError = result.error;
    await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
  }
  return { data: null, error: lastError };
}

type RouteHandler = (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error: any) {
      console.error(`[API] Unhandled error in ${request.nextUrl.pathname}:`, error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

export async function getUserRole(
  supabase: ReturnType<typeof createServerClient>,
  existingUser?: { id: string },
): Promise<string[]> {
  try {
    const { data: roles } = await supabase.rpc("get_user_roles");

    if (Array.isArray(roles) && roles.length > 0) {
      if (!roles.includes("teacher") && !roles.includes("admin")) {
        return await supplementWithLegacyRole(supabase, roles, existingUser);
      }
      return roles;
    }

    return await getLegacyRoleOnly(supabase, existingUser);
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return [];
  }
}

async function supplementWithLegacyRole(
  supabase: ReturnType<typeof createServerClient>,
  roles: string[],
  existingUser?: { id: string },
): Promise<string[]> {
  let userId = existingUser?.id;
  if (!userId) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return roles;
    userId = user.id;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (profile?.role && !roles.includes(profile.role)) {
    return [...roles, profile.role];
  }
  return roles;
}

async function getLegacyRoleOnly(
  supabase: ReturnType<typeof createServerClient>,
  existingUser?: { id: string },
): Promise<string[]> {
  let userId = existingUser?.id;
  if (!userId) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return [];
    userId = user.id;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (profile?.role) return [profile.role];
  return [];
}

export async function requireAuth(
  supabase: ReturnType<typeof createServerClient>,
  jwt?: string,
): Promise<string | null> {
  const { data: { user } } = jwt
    ? await supabase.auth.getUser(jwt)
    : await supabase.auth.getUser();
  if (!user) return null;
  return user.id;
}

export async function requireTeacher(
  supabase: ReturnType<typeof createServerClient>,
  jwt?: string,
): Promise<string | null> {
  const { data: { user } } = jwt
    ? await supabase.auth.getUser(jwt)
    : await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, roles")
    .eq("user_id", user.id)
    .single();

  const hasRole =
    profile?.role === "teacher" ||
    profile?.role === "admin" ||
    profile?.roles?.includes?.("teacher") ||
    profile?.roles?.includes?.("admin");

  if (!hasRole) return null;

  return user.id;
}

export async function requireAdmin(
  supabase: ReturnType<typeof createServerClient>,
  jwt?: string,
): Promise<string | null> {
  const { data: { user } } = jwt
    ? await supabase.auth.getUser(jwt)
    : await supabase.auth.getUser();
  if (!user) return null;
  const role = await getUserRole(supabase, user);
  if (!role?.includes("admin")) return null;
  return user.id;
}

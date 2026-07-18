import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export function extractBearerToken(request: NextRequest): string | undefined {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
}

export function createApiSupabaseClient(request: NextRequest) {
  let mutableResponse = NextResponse.next({ request: { headers: request.headers } });

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
            mutableResponse = NextResponse.next({ request: { headers: request.headers } });
            mutableResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  function applyCookies(response: NextResponse): NextResponse {
    mutableResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, cookie);
    });
    return response;
  }

  return { supabase, applyCookies };
}

export type ApiSupabase = ReturnType<typeof createApiSupabaseClient>;

export async function getUserRole(
  supabase: ReturnType<typeof createServerClient>,
  existingUser?: { id: string },
): Promise<string[]> {
  try {
    console.log("[DEBUG getUserRole] calling get_user_roles RPC, user:", existingUser?.id);
    const { data: roles, error: rpcError } = await supabase.rpc("get_user_roles");
    if (rpcError) {
      console.warn("get_user_roles RPC failed, falling back to profiles.role:", rpcError.message);
    }

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
    .eq("id", userId)
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
    .eq("id", userId)
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
  try {
    const { data: { user }, error: userError } = jwt
      ? await supabase.auth.getUser(jwt)
      : await supabase.auth.getUser();

    if (userError) {
      console.error("=== DIAGNOSIS: SUPABASE AUTH ERROR ===", userError.message, userError.status);
      return null;
    }
    if (!user) {
      console.error("=== DIAGNOSIS: NO USER FOUND FOR THIS JWT ===", jwt ? "JWT provided" : "no JWT");
      return null;
    }

    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .select("role, roles")
      .eq("id", user.id)
      .single();

    if (dbError) {
      console.error("=== DIAGNOSIS: DATABASE ROLE FETCH FAILED ===", dbError.message, dbError.code);
      return null;
    }

    console.log("=== DIAGNOSIS: SUCCESS ===", {
      userId: user.id,
      dbRoleField: profile?.role,
      dbRolesArrayField: profile?.roles,
    });

    const hasRole =
      profile?.role === "teacher" ||
      profile?.role === "admin" ||
      profile?.roles?.includes?.("teacher") ||
      profile?.roles?.includes?.("admin");

    if (!hasRole) {
      console.error("=== DIAGNOSIS: ROLE CHECK FAILED ===", { role: profile?.role, roles: profile?.roles });
      return null;
    }

    return user.id;
  } catch (e: any) {
    console.error("=== DIAGNOSIS: CRASH IN requireTeacher ===", e.message);
    return null;
  }
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

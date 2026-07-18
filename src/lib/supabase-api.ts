import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export function extractBearerToken(request: NextRequest): string | undefined {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
}

export function createApiSupabaseClient(request: NextRequest) {
  const cookiesToSet: { name: string; value: string; options: any }[] = [];

  const allCookies = request.cookies.getAll();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieEncoding: "base64url",
      cookies: {
        getAll() {
          return allCookies;
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            cookiesToSet.push(cookie);
            request.cookies.set(cookie.name, cookie.value);
          });
        },
      },
    },
  );

  function applyCookies(response: NextResponse): NextResponse {
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
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
  const { data: { user }, error: userError } = jwt
    ? await supabase.auth.getUser(jwt)
    : await supabase.auth.getUser();

  if (userError) console.log("[DEBUG requireTeacher] getUser error:", userError.message);
  if (!user) {
    console.log("[DEBUG requireTeacher] no user returned", jwt ? "(with JWT)" : "(without JWT)");
    return null;
  }

  const role = await getUserRole(supabase, user);
  console.log("[DEBUG requireTeacher] user:", user.id, "role:", role);
  if (!role?.includes("teacher") && !role?.includes("admin")) {
    console.log("[DEBUG requireTeacher] role check failed, role =", role);
    return null;
  }
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

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export function createApiSupabaseClient(request: NextRequest) {
  const cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookiesToSet.push(...cookies);
          cookies.forEach(({ name, value }) => {
            request.cookies.set(name, value);
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

export async function requireAuth(supabase: ReturnType<typeof createServerClient>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
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
  if (!user) {
    console.warn("[requireTeacher] getUser() returned null — session may be expired");
    return null;
  }
  const role = await getUserRole(supabase, user);
  if (!role?.includes("teacher") && !role?.includes("admin")) {
    console.warn("[requireTeacher] user", user.id, "has role", role, "— not teacher/admin");
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

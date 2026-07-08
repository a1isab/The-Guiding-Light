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

export async function getUserRole(supabase: ReturnType<typeof createServerClient>): Promise<string[]> {
  try {
    const { data: roles, error: rpcError } = await supabase.rpc("get_user_roles");
    if (rpcError) {
      console.warn("get_user_roles RPC failed, falling back to profiles.role:", rpcError.message);
    }

    if (Array.isArray(roles) && roles.length > 0) {
      return roles;
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return [];

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role) {
      return [profile.role];
    }

    return [];
  } catch (error) {
    console.error("Error in getUserRole fallback helper:", error);
    return [];
  }
}

export async function requireAuth(supabase: ReturnType<typeof createServerClient>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user.id;
}

export async function requireTeacher(supabase: ReturnType<typeof createServerClient>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn("[requireTeacher] getUser() returned null — session may be expired");
    return null;
  }
  const role = await getUserRole(supabase);
  if (!role?.includes("teacher") && !role?.includes("admin")) {
    console.warn("[requireTeacher] user", user.id, "has role", role, "— not teacher/admin");
    return null;
  }
  return user.id;
}

export async function requireAdmin(supabase: ReturnType<typeof createServerClient>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const role = await getUserRole(supabase);
  if (!role?.includes("admin")) return null;
  return user.id;
}

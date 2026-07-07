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

export async function getUserRole(supabase: ReturnType<typeof createServerClient>): Promise<string[] | null> {
  const { data: role, error } = await supabase.rpc("get_user_roles");
  if (error) {
    console.warn("get_user_roles RPC failed, falling back to profiles.role:", error.message);
  }
  if (role && role.length > 0) return role as string[];

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .maybeSingle();
  if (!profile?.role) return null;
  return [profile.role];
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

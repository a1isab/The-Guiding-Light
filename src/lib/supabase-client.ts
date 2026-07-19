import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieEncoding: "base64url",
      cookieOptions: {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
}

export async function getUserRoleClient(supabase: SupabaseClient): Promise<string[] | null> {
  const { data: role, error } = await supabase.rpc("get_user_roles");
  if (role && role.length > 0) return role as string[];
  if (error) console.warn("get_user_roles RPC failed, falling back:", error.message);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .maybeSingle();
  if (!profile?.role) return null;
  return [profile.role];
}

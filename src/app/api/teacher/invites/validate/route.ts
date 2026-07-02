import { type NextRequest, NextResponse } from "next/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ valid: false, message: "Code is required" }, { status: 400 });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: invite, error } = await supabase
    .from("teacher_invites")
    .select("id, code, used_by, used_at, expires_at")
    .eq("code", code.trim())
    .single();

  if (error || !invite) {
    return NextResponse.json({ valid: false, message: "Invalid invite code" });
  }

  if (invite.used_by) {
    return NextResponse.json({ valid: false, message: "This invite code has already been used" });
  }

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, message: "This invite code has expired" });
  }

  return NextResponse.json({ valid: true, message: "Invite code is valid" });
}

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ role: null });
    }

    // Pakai service_role key — bypass RLS
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: member } = await adminSupabase
      .from("members")
      .select("role_id(name)")
      .eq("auth_id", userId)
      .maybeSingle();

    const roleObj = member?.role_id as { name: string } | null | undefined;
    return NextResponse.json({ role: roleObj?.name ?? null });
  } catch (err) {
    console.error("check-role error:", err);
    return NextResponse.json({ role: null });
  }
}

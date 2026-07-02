"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;

  const supabase = await createServerClient();

  // 1. Register auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Gagal membuat akun" };
  }

  // 2. Create member profile
  const { error: memberError } = await supabase.from("members").insert({
    auth_id: authData.user.id,
    email,
    full_name: fullName,
    phone: phone || null,
    member_id: `PRI-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`,
    status: "active",
    role_id: (await supabase.from("roles").select("id").eq("name", "member").single()).data?.id,
  });

  if (memberError) {
    return { error: memberError.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.startsWith("sb-")) {
      cookieStore.delete(cookie.name);
    }
  }

  revalidatePath("/", "layout");
}

export async function getCurrentUserRole(): Promise<{ role: string | null }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { role: null };

  const { data: member } = await supabase
    .from("members")
    .select("role_id!inner(name)")
    .eq("auth_id", user.id)
    .single();

  return { role: member?.role_id?.name ?? null };
}

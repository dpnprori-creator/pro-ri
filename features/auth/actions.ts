"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/types/database";

type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];

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
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const occupation = formData.get("occupation") as string;

  const supabase = await createServerClient();

  // 1. Register auth user — trigger on_auth_user_created will auto-create member
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

  // 2. Update the trigger-created member with additional registration fields
  // Use admin client to bypass RLS (user not yet authenticated if email confirmation is on)
  const adminSupabase = createAdminClient();

  const technologyInterest = formData.getAll("technologyInterest") as string[];

  // Collect fields to update (only non-empty values)
  const updateFields: MemberUpdate = {};
  if (phone) updateFields.phone = phone;
  if (occupation) updateFields.occupation = occupation;
  if (technologyInterest.length > 0) updateFields.technology_interest = technologyInterest;
  updateFields.province_id = (formData.get("provinceId") as string) || null;
  updateFields.regency_id = (formData.get("regencyId") as string) || null;
  updateFields.district_id = (formData.get("districtId") as string) || null;
  updateFields.village_id = (formData.get("villageId") as string) || null;

  const { error: memberError } = await adminSupabase
    .from("members")
    .update(updateFields)
    .eq("auth_id", authData.user.id);

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

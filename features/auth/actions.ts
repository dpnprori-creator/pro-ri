"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { registerSchema } from "./schemas";
import type { Database } from "@/lib/types/database";

type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];
type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];

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
  try {
    const supabase = await createServerClient();
    const adminSupabase = createAdminClient();

    // 1. Validate form data with Zod
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      occupation: formData.get("occupation") as string,
      provinceId: formData.get("provinceId") as string,
      regencyId: formData.get("regencyId") as string,
      districtId: formData.get("districtId") as string,
      villageId: formData.get("villageId") as string,
      technologyInterest: formData.getAll("technologyInterest") as string[],
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const parsed = registerSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return { error: firstError.message };
    }

    const { email, password, fullName, phone, occupation, provinceId, regencyId, districtId, villageId, technologyInterest } = parsed.data;

    // 2. Register auth user — trigger on_auth_user_created will auto-create member
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
      console.error("Auth signup error:", authError);
      const message = authError?.message || authError?.status || "Kesalahan autentikasi dari server";
      if (!message || message === "{}" || message === "undefined") {
        return { error: "Gagal terhubung ke server autentikasi. Periksa konfigurasi Supabase." };
      }
      return { error: message };
    }

    if (!authData.user) {
      return { error: "Gagal membuat akun. Silakan coba lagi." };
    }

    // 3. Check if the trigger created the member record
    const { data: existingMember } = await adminSupabase
      .from("members")
      .select("id")
      .eq("auth_id", authData.user.id)
      .maybeSingle();

    if (existingMember) {
      // 3a. Trigger created the member — update with additional fields
      const updateFields: MemberUpdate = {
        phone,
        occupation,
        province_id: provinceId,
        regency_id: regencyId,
        district_id: districtId,
        village_id: villageId,
      };
      if (technologyInterest.length > 0) {
        updateFields.technology_interest = technologyInterest;
      }

      const { error: updateError } = await adminSupabase
        .from("members")
        .update(updateFields)
        .eq("auth_id", authData.user.id);

      if (updateError) {
        console.error("Member update error:", updateError);
        return { error: updateError?.message || "Gagal memperbarui data anggota" };
      }
    } else {
      // 3b. Trigger didn't create the member — insert directly
      const insertFields: MemberInsert = {
        auth_id: authData.user.id,
        member_id: `PRI-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`,
        full_name: fullName,
        email,
        phone,
        occupation,
        province_id: provinceId,
        regency_id: regencyId,
        district_id: districtId,
        village_id: villageId,
        status: "active",
      };
      if (technologyInterest.length > 0) {
        insertFields.technology_interest = technologyInterest;
      }

      const { error: insertError } = await adminSupabase
        .from("members")
        .insert(insertFields);

      if (insertError) {
        console.error("Member insert error:", insertError);
        return { error: insertError?.message || "Gagal membuat data anggota" };
      }
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    console.error("Registration error:", err);
    return { error: "Terjadi kesalahan saat mendaftar. Silakan coba lagi." };
  }
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

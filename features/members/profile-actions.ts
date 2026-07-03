"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getProfile() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: member } = await supabase
    .from("members")
    .select("*, province_id!inner(name), regency_id!inner(name)")
    .eq("auth_id", user.id)
    .single();

  return member;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { error: "Member not found" };

  const updates: any = {};

  // Map form field names (camelCase from client) → DB column names (snake_case)
  const fieldMap: Record<string, string> = {
    fullName: "full_name",
    phone: "phone",
    occupation: "occupation",
    provinceId: "province_id",
    regencyId: "regency_id",
    districtId: "district_id",
    villageId: "village_id",
  };

  for (const [formKey, dbField] of Object.entries(fieldMap)) {
    const value = formData.get(formKey);
    if (value) updates[dbField] = value as string;
  }

  const techInterest = formData.get("technology_interest");
  if (techInterest) {
    try {
      updates.technology_interest = JSON.parse(techInterest as string);
    } catch {
      updates.technology_interest = [(techInterest as string)];
    }
  }

  if (Object.keys(updates).length === 0) return { error: "No fields to update" };

  const { error } = await supabase
    .from("members")
    .update(updates)
    .eq("id", member.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  return { success: "Profile updated" };
}

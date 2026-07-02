"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function submitMemberCard(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan login terlebih dahulu" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { error: "Data member tidak ditemukan" };

  const { error } = await supabase.from("member_cards").insert({
    user_id: member.id,
    full_name: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string || null,
    family_count: parseInt(formData.get("familyCount") as string) || 0,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Anda sudah memiliki kartu anggota" };
    }
    return { error: "Gagal mendaftar kartu anggota" };
  }

  revalidatePath("/membership");
  return { success: "Pendaftaran kartu anggota berhasil" };
}

export async function getMemberCards() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("member_cards")
    .select("*, user_id!inner(full_name, email, member_id)")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function verifyMemberCard(id: string, status: "approved" | "rejected", rejectionReason?: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: admin } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  const updates: any = {
    status,
    verified_by: admin?.id ?? null,
    verified_at: new Date().toISOString(),
  };

  if (rejectionReason) {
    updates.rejection_reason = rejectionReason;
  }

  const { error } = await supabase
    .from("member_cards")
    .update(updates)
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/member-verification");
  return { success: true };
}

export async function approveMemberCard(id: string) {
  return verifyMemberCard(id, "approved");
}

export async function rejectMemberCard(id: string, reason?: string) {
  return verifyMemberCard(id, "rejected", reason);
}

export async function checkMemberCardStatus() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return null;

  const { data } = await supabase
    .from("member_cards")
    .select("*")
    .eq("user_id", member.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

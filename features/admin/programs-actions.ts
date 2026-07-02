"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function getPrograms() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getProgramBySlug(slug: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .single();

  return data;
}

export async function createProgram(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  const { error } = await supabase.from("programs").insert({
    title: formData.get("title") as string,
    slug: (formData.get("title") as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    description: formData.get("description") as string || null,
    short_description: formData.get("short_description") as string || null,
    icon: formData.get("icon") as string || "BookOpen",
    status: formData.get("status") as string || "active",
    label: formData.get("label") as string || "Program",
    created_by: member?.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/programs");
  return { success: true };
}

export async function updateProgram(id: string, formData: FormData) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("programs")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      short_description: formData.get("short_description") as string || null,
      status: formData.get("status") as string,
      label: formData.get("label") as string,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/programs");
  return { success: true };
}

export async function registerForProgram(programId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan login terlebih dahulu" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { error: "Data member tidak ditemukan" };

  const { error } = await supabase.from("program_registrations").insert({
    program_id: programId,
    member_id: member.id,
    status: "registered",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Anda sudah terdaftar di program ini" };
    }
    return { error: "Gagal mendaftar program" };
  }

  revalidatePath("/programs");
  return { success: true, message: "Pendaftaran program berhasil" };
}

export async function cancelProgramRegistration(programId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan login terlebih dahulu" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { error: "Data member tidak ditemukan" };

  const { error } = await supabase
    .from("program_registrations")
    .update({ status: "cancelled" })
    .eq("program_id", programId)
    .eq("member_id", member.id);

  if (error) return { error: "Gagal membatalkan pendaftaran" };

  revalidatePath("/programs");
  return { success: true, message: "Pendaftaran dibatalkan" };
}

export async function getProgramRegistrations(programId: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("program_registrations")
    .select("*, member_id!inner(full_name, email, member_id)")
    .eq("program_id", programId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function updateProgramRegistrationStatus(registrationId: string, status: string) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("program_registrations")
    .update({ status })
    .eq("id", registrationId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteProgram(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("programs").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/programs");
  return { success: true };
}

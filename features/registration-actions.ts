"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function registerMemberCard(formData: FormData) {
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
    full_name: formData.get("full_name") as string,
    phone: formData.get("phone") as string,
    family_count: parseInt(formData.get("family_count") as string) || 0,
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

export async function lookupMemberByMemberId(memberId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("members")
    .select("id, full_name, member_id")
    .eq("member_id", memberId)
    .maybeSingle();

  if (error || !data) {
    return { error: "Member ID tidak ditemukan" };
  }

  return { member: data };
}

export async function registerProgramByMemberId(programId: string, memberId: string, fullName: string) {
  const supabase = await createServerClient();

  // Check program is open for registration
  const { data: program } = await supabase
    .from("programs")
    .select("label, status")
    .eq("id", programId)
    .single();

  if (!program) return { error: "Program tidak ditemukan" };
  if (program.label !== "dibuka") {
    return { error: "Program ini belum dibuka untuk pendaftaran" };
  }
  if (program.status !== "published") {
    return { error: "Program ini belum tersedia" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("member_id", memberId)
    .single();

  if (!member) return { error: "Member tidak ditemukan" };

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

export async function registerEventByMemberId(eventId: string, memberId: string, fullName: string) {
  const supabase = await createServerClient();

  // Check event is open for registration (status must be 'published' and end_date not passed)
  const { data: event } = await supabase
    .from("events")
    .select("status, start_date, end_date")
    .eq("id", eventId)
    .single();

  if (!event) return { error: "Event tidak ditemukan" };
  if (event.status !== "published") {
    return { error: "Event ini belum dibuka untuk pendaftaran" };
  }
  if (new Date(event.end_date) < new Date()) {
    return { error: "Event ini sudah selesai" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("member_id", memberId)
    .single();

  if (!member) return { error: "Member tidak ditemukan" };

  const { error } = await supabase.from("event_registrations").insert({
    event_id: eventId,
    member_id: member.id,
    status: "registered",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Anda sudah terdaftar di event ini" };
    }
    return { error: "Gagal mendaftar event" };
  }

  revalidatePath("/events");
  return { success: true, message: "Pendaftaran event berhasil" };
}

export async function registerProgram(programId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan login terlebih dahulu" };

  // Check program is open for registration
  const { data: program } = await supabase
    .from("programs")
    .select("label, status")
    .eq("id", programId)
    .single();

  if (!program) return { error: "Program tidak ditemukan" };
  if (program.label !== "dibuka") {
    return { error: "Program ini belum dibuka untuk pendaftaran" };
  }
  if (program.status !== "published") {
    return { error: "Program ini belum tersedia" };
  }

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
  return { success: "Berhasil mendaftar program" };
}

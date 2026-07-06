"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];

export async function registerForEvent(eventId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan login terlebih dahulu" };

  // Check event is open for registration
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
    .eq("auth_id", user.id)
    .single();

  if (!member) return { error: "Data member tidak ditemukan" };

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

  revalidatePath(`/events/${eventId}`);
  return { success: "Berhasil mendaftar event" };
}

export async function cancelRegistration(eventId: string) {
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
    .from("event_registrations")
    .update({ status: "cancelled" })
    .eq("event_id", eventId)
    .eq("member_id", member.id);

  if (error) return { error: "Gagal membatalkan pendaftaran" };

  revalidatePath(`/events/${eventId}`);
  return { success: "Pendaftaran dibatalkan" };
}

export async function checkRegistration(eventId: string): Promise<{ registered: boolean }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { registered: false };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { registered: false };

  const { data } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("member_id", member.id)
    .neq("status", "cancelled")
    .maybeSingle();

  return { registered: !!data };
}

export async function getEventRegistrations(eventId: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("event_registrations")
    .select("*, member_id!inner(full_name, email, member_id)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function updateEventRegistrationStatus(registrationId: string, status: string) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("event_registrations")
    .update({ status, attended_at: status === "attended" ? new Date().toISOString() : null })
    .eq("id", registrationId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getPendingVerificationCount() {
  const supabase = await createServerClient();

  const [{ count: verifikasi }, { count: verifikasiAnggota }] = await Promise.all([
    supabase.from("certificates").select("*", { count: "exact", head: true }).eq("verified", false),
    supabase.from("member_cards").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return { verifikasi: verifikasi ?? 0, verifikasiAnggota: verifikasiAnggota ?? 0 };
}

export async function getEvents() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("events")
    .select("id, title, slug, description, category, type, start_date, end_date, location, banner_url, status, max_participants, province_id")
    .order("start_date", { ascending: false });

  return data ?? [];
}

export async function getEventBySlug(slug: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("events")
    .select("*, province_id!inner(name)")
    .eq("slug", slug)
    .single();

  return data;
}

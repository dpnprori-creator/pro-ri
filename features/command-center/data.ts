export interface ProvinceStats {
  id: string;
  code: string;
  name: string;
  capital: string | null;
  latitude: number | null;
  longitude: number | null;
  total_members: number;
  total_trainers: number;
  total_mentors: number;
  total_events: number;
  total_innovations: number;
  created_at: string;
}

export interface RegencyStats {
  id: string;
  name: string;
  province_id: string;
  code: string;
  latitude: number | null;
  longitude: number | null;
  total_members: number;
  total_trainers: number;
  total_events: number;
  total_innovations: number;
  created_at: string;
}

export interface DistrictStats {
  id: string;
  name: string;
  regency_id: string;
  code: string;
  total_members: number;
  created_at: string;
}

export interface VillageStats {
  id: string;
  name: string;
  district_id: string;
  code: string;
  total_members: number;
  created_at: string;
}

export interface MonthlyGrowth {
  month: string;
  count: number;
  new_members: number;
  cumulative: number;
}

export interface CommandCenterStats {
  totalMembers: number;
  totalTrainers: number;
  totalMentors: number;
  totalEvents: number;
  totalInnovations: number;
  totalNews: number;
  totalCertificates: number;
  totalProvinces: number;
  activeMembers: number;
  memberProgress: number;
  trainerProgress: number;
  mentorProgress: number;
  topProvinces: { name: string; total_members: number; total_events: number; total_innovations: number }[];
  memberGrowth: { created_at: string }[];
}

export interface CategoryDistribution {
  name: string;
  count: number;
  category: string;
}

import { createClient as createServerClient } from "@/lib/supabase/server";

export async function getCommandCenterStats() {
  return getStats();
}

export async function getProvinceStats() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("provinces")
    .select("id, name, total_members, total_events, total_innovations")
    .order("total_members", { ascending: false });
  return data ?? [];
}

export async function getAllRegencyStats() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("regencies")
    .select("id, name, province_id, total_members, total_events, total_innovations")
    .order("total_members", { ascending: false });
  return data ?? [];
}

export async function getAllDistrictStats() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("districts")
    .select("id, name, regency_id, total_members")
    .order("total_members", { ascending: false });
  return data ?? [];
}

export async function getAllVillageStats() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("villages")
    .select("id, name, district_id")
    .order("name", { ascending: true });
  return data ?? [];
}

export async function getMonthlyGrowth(months: number = 12) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("members")
    .select("created_at")
    .gte("created_at", new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getTechDistribution() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("members")
    .select("technology_interest")
    .not("technology_interest", "is", null);

  const distribution: Record<string, number> = {};
  for (const row of data ?? []) {
    if (Array.isArray(row.technology_interest)) {
      for (const tech of row.technology_interest) {
        distribution[tech] = (distribution[tech] || 0) + 1;
      }
    }
  }
  return distribution;
}

export async function getStats() {
  const supabase = await createServerClient();

  const [
    { count: totalMembers },
    { count: totalEvents },
    { count: totalInnovations },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("events").select("*", { count: "exact", head: true }).gte("end_date", new Date().toISOString()),
    supabase.from("innovations").select("*", { count: "exact", head: true }).neq("status", "archived"),
  ]);

  // Get trainer/mentor counts via member_designations table
  const [
    { count: totalTrainers },
    { count: totalMentors },
  ] = await Promise.all([
    supabase.from("member_designations").select("*", { count: "exact", head: true }).eq("designation", "trainer"),
    supabase.from("member_designations").select("*", { count: "exact", head: true }).eq("designation", "mentor"),
  ]);

  const { data: provinces } = await supabase
    .from("provinces")
    .select("name, total_members, total_events, total_innovations")
    .order("total_members", { ascending: false })
    .limit(5);

  const { data: growth } = await supabase
    .from("members")
    .select("created_at")
    .gte("created_at", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: true });

  return {
    totalMembers: totalMembers ?? 0,
    totalTrainers: totalTrainers ?? 0,
    totalMentors: totalMentors ?? 0,
    totalEvents: totalEvents ?? 0,
    totalInnovations: totalInnovations ?? 0,
    topProvinces: provinces ?? [],
    memberGrowth: growth ?? [],
  };
}

export async function getProvinceDetail(provinceId: string) {
  const supabase = await createServerClient();

  const { data: province } = await supabase
    .from("provinces")
    .select("*")
    .eq("id", provinceId)
    .single();

  const { data: regencies } = await supabase
    .from("regencies")
    .select("name, total_members, total_events, total_innovations")
    .eq("province_id", provinceId)
    .order("total_members", { ascending: false });

  return { province, regencies: regencies ?? [] };
}

export async function getRegencyDetail(regencyId: string) {
  const supabase = await createServerClient();

  const { data: regency } = await supabase
    .from("regencies")
    .select("*")
    .eq("id", regencyId)
    .single();

  const { data: districts } = await supabase
    .from("districts")
    .select("name, total_members")
    .eq("regency_id", regencyId)
    .order("total_members", { ascending: false });

  return { regency, districts: districts ?? [] };
}

export async function getDashboardEvents() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("events")
    .select("id, title, start_date, end_date, status, category, province_id!inner(name)")
    .order("start_date", { ascending: false })
    .limit(10);

  return data ?? [];
}

export async function getDashboardInnovations() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("innovations")
    .select("id, title, category, status, province_id!inner(name), creator_id!inner(full_name)")
    .order("created_at", { ascending: false })
    .limit(10);

  return data ?? [];
}

export async function getRegencyStats(regencyId: string) {
  const supabase = await createServerClient();

  const { data: regency } = await supabase
    .from("regencies")
    .select("name, total_members, total_trainers, total_events, total_innovations")
    .eq("id", regencyId)
    .single();

  return regency;
}

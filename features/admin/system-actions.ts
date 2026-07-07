"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ============================================
// SYSTEM SETTINGS
// ============================================

export async function getSystemSettings() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("system_settings")
    .select("*")
    .order("category", { ascending: true });

  return data ?? [];
}

export async function updateSystemSetting(key: string, value: Record<string, unknown>) {
  const supabase = await createServerClient();

  // Try update first
  const { data: existing, error: checkError } = await (supabase as any)
    .from("system_settings")
    .select("id")
    .eq("key", key)
    .maybeSingle();

  if (checkError) return { error: checkError.message };

  let error;
  if (existing) {
    // Update existing
    const result = await (supabase as any)
      .from("system_settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);
    error = result.error;
  } else {
    // Insert new
    const result = await (supabase as any)
      .from("system_settings")
      .insert({ key, value, label: key.replace(/_/g, " "), category: "custom" });
    error = result.error;
  }

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}

// ============================================
// RECALCULATE COUNTERS (Super Admin only)
// ============================================

export async function recalculateAllCounters() {
  const supabase = await createServerClient();
  const adminSupabase = createAdminClient();

  try {
    // JS-based recalculation — update provinces table directly
    const { data: activeMembers } = await supabase
      .from("members")
      .select("province_id")
      .eq("status", "active")
      .not("province_id", "is", null);

    // Count members per province in JS
    const provinceMemberCounts: Record<string, number> = {};
    for (const m of activeMembers ?? []) {
      if (m.province_id) {
        provinceMemberCounts[m.province_id] = (provinceMemberCounts[m.province_id] || 0) + 1;
      }
    }

    // Update provinces table
    for (const [provId, count] of Object.entries(provinceMemberCounts)) {
      await adminSupabase
        .from("provinces")
        .update({ total_members: count })
        .eq("id", provId);
    }

    // Also reset provinces with no members to 0
    await adminSupabase
      .from("provinces")
      .update({ total_members: 0 })
      .not("id", "in", `(${Object.keys(provinceMemberCounts).map(id => `"${id}"`).join(",")})`);

    // Get aggregate counts
    const [memberCount, trainerCount, mentorCount] = await Promise.all([
      adminSupabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
      adminSupabase.from("member_designations").select("*", { count: "exact", head: true }).eq("designation", "trainer"),
      adminSupabase.from("member_designations").select("*", { count: "exact", head: true }).eq("designation", "mentor"),
    ]);

    revalidatePath("/", "layout");
    return {
      success: true,
      data: {
        activeMembers: memberCount.count ?? 0,
        trainers: trainerCount.count ?? 0,
        mentors: mentorCount.count ?? 0,
        provinceCount: Object.keys(provinceMemberCounts).length,
      },
    };
  } catch (err) {
    console.error("Recalculate error:", err);
    return { error: "Gagal merekalkulasi data: " + (err instanceof Error ? err.message : "Unknown error") };
  }
}

// ============================================
// MAINTENANCE MODE
// ============================================

export async function toggleMaintenanceMode(enabled: boolean, message?: string) {
  const supabase = await createServerClient();

  const value: Record<string, unknown> = {
    enabled,
    message: message || "Website sedang dalam perbaikan. Silakan kembali lagi nanti.",
    allowed_roles: ["super_admin", "admin"],
  };

  const { error } = await (supabase as any)
    .from("system_settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", "maintenance");

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true, enabled };
}

// ============================================
// FEATURE TOGGLE
// ============================================

export async function toggleFeature(featureKey: string, enabled: boolean) {
  const supabase = await createServerClient();

  // Get current features
  const { data: current } = await (supabase as any)
    .from("system_settings")
    .select("value")
    .eq("key", "features")
    .single();

  if (!current) return { error: "Pengaturan fitur tidak ditemukan" };

  const features = { ...(current.value as Record<string, boolean>), [featureKey]: enabled };

  const { error } = await (supabase as any)
    .from("system_settings")
    .update({ value: features, updated_at: new Date().toISOString() })
    .eq("key", "features");

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  return { success: true };
}

// ============================================
// SUPER ADMIN — SYSTEM HEALTH CHECK
// ============================================

export async function getSystemHealth() {
  const supabase = await createServerClient();

  const [
    { count: totalMembers },
    { count: activeMembers },
    { count: totalEvents },
    { count: totalInnovations },
    { count: totalCertificates },
    { count: provincesWithMembers },
    { count: pendingCards },
    { count: unreadMessages },
    { count: totalLogs },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("innovations").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
    // Count members with province (approximation for provinces coverage)
    supabase.from("members").select("province_id", { count: "exact", head: true }).eq("status", "active").not("province_id", "is", null),
    supabase.from("member_cards").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("activity_logs").select("*", { count: "exact", head: true }),
  ]);

  // Get role distribution
  const { data: roles } = await supabase
    .from("roles")
    .select("id, name");

  const roleDistribution: Record<string, number> = {};
  if (roles) {
    for (const role of roles) {
      const { count } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true })
        .eq("role_id", role.id);
      roleDistribution[role.name] = count ?? 0;
    }
  }

  return {
    totalMembers: totalMembers ?? 0,
    activeMembers: activeMembers ?? 0,
    totalEvents: totalEvents ?? 0,
    totalInnovations: totalInnovations ?? 0,
    totalCertificates: totalCertificates ?? 0,
    provincesWithMembers: provincesWithMembers ?? 0,
    pendingCards: pendingCards ?? 0,
    unreadMessages: unreadMessages ?? 0,
    totalLogs: totalLogs ?? 0,
    roleDistribution,
  };
}

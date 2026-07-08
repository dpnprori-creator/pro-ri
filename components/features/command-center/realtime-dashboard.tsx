"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RealtimeStats {
  totalMembers: number;
  totalEvents: number;
  totalInnovations: number;
  activeUsers: number;
}

export function RealtimeDashboard() {
  const [stats, setStats] = useState<RealtimeStats>({
    totalMembers: 0,
    totalEvents: 0,
    totalInnovations: 0,
    activeUsers: 0,
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const supabase = createClient();

    // Initial fetch
    const fetchStats = async () => {
      // Check if activity_logs table exists by querying it
      const [
        { count: members },
        { count: events },
        { count: innovations },
      ] = await Promise.all([
        supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("innovations").select("*", { count: "exact", head: true }).neq("status", "archived"),
      ]);

      // Query active users from activity_logs (unique members active in last 15 min)
      const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: recentActivity } = await supabase
        .from("activity_logs")
        .select("member_id")
        .gte("created_at", fifteenMinAgo)
        .not("member_id", "is", null);

      // Count unique member_ids
      const uniqueActive = new Set((recentActivity ?? []).map(a => a.member_id));

      setStats({
        totalMembers: members ?? 0,
        totalEvents: events ?? 0,
        totalInnovations: innovations ?? 0,
        activeUsers: uniqueActive.size,
      });
      setLastUpdate(new Date());
    };

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    fetchStats();

    // Subscribe to realtime changes
    const membersChannel = supabase
      .channel("realtime-members")
      .on("postgres_changes", { event: "*", schema: "public", table: "members" }, () => {
        fetchStats();
      })
      .subscribe();

    const eventsChannel = supabase
      .channel("realtime-events")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(membersChannel);
      supabase.removeChannel(eventsChannel);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Realtime Dashboard</h2>
        <span className="text-xs text-pri-silver">
          Last update: {lastUpdate.toLocaleTimeString("id-ID")}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-pri-black/40 rounded-lg p-3">
          <p className="text-pri-silver text-sm">Total Members</p>
          <p className="text-xl font-bold text-white">{stats.totalMembers}</p>
        </div>
        <div className="bg-pri-black/40 rounded-lg p-3">
          <p className="text-pri-silver text-sm">Active Now</p>
          <p className="text-xl font-bold text-green-400">{stats.activeUsers}</p>
        </div>
        <div className="bg-pri-black/40 rounded-lg p-3">
          <p className="text-pri-silver text-sm">Total Events</p>
          <p className="text-xl font-bold text-white">{stats.totalEvents}</p>
        </div>
        <div className="bg-pri-black/40 rounded-lg p-3">
          <p className="text-pri-silver text-sm">Innovations</p>
          <p className="text-xl font-bold text-white">{stats.totalInnovations}</p>
        </div>
      </div>
    </div>
  );
}

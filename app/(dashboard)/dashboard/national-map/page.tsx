import { createClient } from "@/lib/supabase/server";
import { MonitoringDashboard } from "@/components/features/command-center/monitoring-dashboard";
import { TARGET_MEMBERS, TARGET_TRAINERS, TARGET_MENTORS } from "@/lib/constants";
import {
  getProvinceStats,
  getAllRegencyStats,
  getAllDistrictStats,
  getAllVillageStats,
  getMonthlyGrowth,
  getTechDistribution,
  getStats,
} from "@/features/command-center/data";

export const dynamic = "force-dynamic";

export default async function DashboardNationalMapPage() {
  const [stats, provinces, regencies, districts, villages, growthData, techDistData] = await Promise.all([
    getStats(),
    getProvinceStats(),
    getAllRegencyStats(),
    getAllDistrictStats(),
    getAllVillageStats(),
    getMonthlyGrowth(12),
    getTechDistribution(),
  ]);

  // Aggregate monthly growth
  const monthlyMap: Record<string, number> = {};
  for (const d of growthData) {
    const m = d.created_at?.slice(0, 7);
    if (m) monthlyMap[m] = (monthlyMap[m] || 0) + 1;
  }

  const sortedMonths = Object.keys(monthlyMap).sort();
  let cumulative = 0;
  const monthlyGrowth = sortedMonths.map((month) => {
    const newMembers = monthlyMap[month];
    cumulative += newMembers;
    return { month, count: newMembers, new_members: newMembers, cumulative };
  });

  // Convert tech distribution
  const techDist = Object.entries(techDistData)
    .map(([category, count]) => ({ name: category, count, category }))
    .sort((a, b) => b.count - a.count);

  const fullStats = {
    ...stats,
    totalNews: 0,
    totalCertificates: 0,
    totalProvinces: provinces.length,
    activeMembers: stats.totalMembers,
    memberProgress: stats.totalMembers > 0 ? Math.min((stats.totalMembers / TARGET_MEMBERS) * 100, 100) : 0,
    trainerProgress: stats.totalTrainers > 0 ? Math.min((stats.totalTrainers / TARGET_TRAINERS) * 100, 100) : 0,
    mentorProgress: stats.totalMentors > 0 ? Math.min((stats.totalMentors / TARGET_MENTORS) * 100, 100) : 0,
  };

  return (
    <div className="space-y-6">
      <MonitoringDashboard
        stats={fullStats as any}
        provinces={provinces}
        regencies={regencies}
        districts={districts}
        villages={villages}
        growth={monthlyGrowth}
        techDist={techDist}
      />
    </div>
  );
}

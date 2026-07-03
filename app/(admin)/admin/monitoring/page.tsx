import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { RealtimeDashboard } from "@/components/features/command-center/realtime-dashboard";
import { MonitoringDashboardClient } from "./monitoring-client";
import { getProvinceStats, getAllRegencyStats, getAllDistrictStats, getAllVillageStats, getMonthlyGrowth, getTechDistribution, getStats } from "@/features/command-center/data";

export const dynamic = "force-dynamic";

export default async function MonitoringPage() {
  const [stats, provinces, regencies, districts, villages, growthData, techDistData] = await Promise.all([
    getStats(),
    getProvinceStats(),
    getAllRegencyStats(),
    getAllDistrictStats(),
    getAllVillageStats(),
    getMonthlyGrowth(12),
    getTechDistribution(),
  ]);

  // Aggregate monthly growth from member creation dates
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

  // Convert tech distribution to array format
  const techDist = Object.entries(techDistData)
    .map(([category, count]) => ({ name: category, count, category }))
    .sort((a, b) => b.count - a.count);

  // Calculate progress targets
  const TARGET_MEMBERS = 10000;
  const TARGET_TRAINERS = 500;
  const TARGET_MENTORS = 200;

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
      <div>
        <h1 className="text-2xl font-bold text-white">Monitoring & Command Center</h1>
        <p className="text-pri-silver mt-1">Pemantauan nasional real-time</p>
      </div>

      <RealtimeDashboard />

      <Suspense fallback={
        <div className="h-[500px] rounded-xl bg-pri-dark flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-pri-red" />
        </div>
      }>
        <MonitoringDashboardClient
          stats={fullStats}
          provinces={provinces}
          regencies={regencies}
          districts={districts}
          villages={villages}
          growth={monthlyGrowth}
          techDist={techDist}
        />
      </Suspense>
    </div>
  );
}

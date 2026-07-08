import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { APP_NAME, TARGET_MEMBERS, TARGET_TRAINERS, TARGET_MENTORS } from "@/lib/constants";
import { RealtimeDashboard } from "@/components/features/command-center/realtime-dashboard";
import { MonitoringDashboardClient } from "@/app/(admin)/admin/monitoring/monitoring-client";
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

export default async function NationalMapPage() {
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
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 circuit-pattern overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-pri-red/5 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-pri-red/5 blur-3xl" />
        </div>
        <div className="tech-particles">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="tech-particle"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: '100%',
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>
        <div className="hero-scan-line" />
        <div className="orbit-ring" style={{ top: '15%', right: '5%', width: '120px', height: '120px', opacity: 0.06 }} />
        <div className="orbit-ring orbit-ring-2" style={{ bottom: '20%', left: '8%', width: '80px', height: '80px', opacity: 0.04 }} />

        <div className="container-wide px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <div className="relative">
                <span className="status-dot" />
              </div>
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Command Center Nasional — Live Monitoring
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Peta Nasional{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pri-red to-red-400">
                {APP_NAME}
              </span>
            </h1>
            <p className="text-pri-silver text-sm md:text-base max-w-2xl mx-auto">
              Visualisasi interaktif sebaran anggota berdasarkan lokasi domisili secara real-time.
              Klik provinsi untuk eksplorasi data hingga level desa/kelurahan.
            </p>
          </div>
        </div>
      </section>

      {/* Realtime Dashboard Stats */}
      <section className="pb-8 px-4">
        <div className="container-wide">
          <RealtimeDashboard />
        </div>
      </section>

      {/* Map & Dashboard Content */}
      <section className="pb-16 px-4">
        <div className="container-wide">
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
      </section>
    </>
  );
}

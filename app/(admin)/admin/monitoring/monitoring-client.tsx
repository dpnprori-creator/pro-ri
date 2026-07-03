"use client";

import { MonitoringDashboard } from "@/components/features/command-center/monitoring-dashboard";
import type { CommandCenterStats, ProvinceStats, RegencyStats, DistrictStats, VillageStats, MonthlyGrowth, CategoryDistribution } from "@/features/command-center/data";

interface MonitoringClientProps {
  stats: CommandCenterStats;
  provinces: ProvinceStats[];
  regencies: RegencyStats[];
  districts: DistrictStats[];
  villages: VillageStats[];
  growth: MonthlyGrowth[];
  techDist: CategoryDistribution[];
}

export function MonitoringDashboardClient(props: MonitoringClientProps) {
  return <MonitoringDashboard {...props} />;
}

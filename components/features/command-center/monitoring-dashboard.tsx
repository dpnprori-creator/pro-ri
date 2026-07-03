"use client";

import { useState } from "react";
import { Target, TrendingUp, MapIcon, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndonesiaMap } from "./indonesia-map";
import { ProvinceDetailPanel } from "./province-detail";
import { RegencyDetailPanel } from "./regency-detail";
import { DistrictDetailPanel } from "./district-detail";
import { ProvinceCsvExport } from "./csv-export";
import { KpiCards, TargetProgress } from "./kpi-tracker";
import { GrowthAreaChart, GrowthBarChart, TechDistributionChart } from "./growth-chart";
import type {
  CommandCenterStats,
  ProvinceStats,
  RegencyStats,
  DistrictStats,
  VillageStats,
  MonthlyGrowth,
  CategoryDistribution,
} from "@/features/command-center/data";

interface MonitoringDashboardProps {
  stats: CommandCenterStats;
  provinces: ProvinceStats[];
  regencies: RegencyStats[];
  districts: DistrictStats[];
  villages: VillageStats[];
  growth: MonthlyGrowth[];
  techDist: CategoryDistribution[];
}

export function MonitoringDashboard({
  stats,
  provinces,
  regencies,
  districts,
  villages,
  growth,
  techDist,
}: MonitoringDashboardProps) {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceStats | null>(null);
  const [selectedRegency, setSelectedRegency] = useState<RegencyStats | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictStats | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  const activeProvinces = provinces.filter((p) => p.total_members > 0);
  const topProvinces = [...activeProvinces]
    .sort((a, b) => b.total_members - a.total_members)
    .slice(0, 15);

  // Filter data by selection
  const provinceRegencies = selectedProvince
    ? regencies.filter((r) => r.province_id === selectedProvince.id)
    : [];

  const regencyDistricts = selectedRegency
    ? districts.filter((d) => d.regency_id === selectedRegency.id)
    : [];

  const districtVillages = selectedDistrict
    ? villages.filter((v) => v.district_id === selectedDistrict.id)
    : [];

  // Find province name for regency
  const regencyProvince = selectedRegency
    ? provinces.find((p) => p.id === selectedRegency.province_id)
    : null;

  // Find regency name for district
  const districtRegency = selectedDistrict
    ? regencies.find((r) => r.id === selectedDistrict.regency_id)
    : null;

  // Current drill level for the panel
  const drillLevel = selectedDistrict
    ? "district"
    : selectedRegency
    ? "regency"
    : selectedProvince
    ? "province"
    : "list";

  function handleClose() {
    setSelectedProvince(null);
    setSelectedRegency(null);
    setSelectedDistrict(null);
  }

  function handleProvinceSelect(prov: ProvinceStats | null) {
    setSelectedProvince(prov);
    setSelectedRegency(null);
    setSelectedDistrict(null);
  }

  function handleRegencySelect(reg: RegencyStats) {
    setSelectedRegency(reg);
    setSelectedDistrict(null);
  }

  function handleDistrictSelect(dist: DistrictStats) {
    setSelectedDistrict(dist);
  }

  function handleBackFromRegency() {
    setSelectedRegency(null);
  }

  function handleBackFromDistrict() {
    setSelectedDistrict(null);
  }

  // Selected province ID for map highlighting
  const mapSelectedProvince = selectedProvince?.id || null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header with circuit-border */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="hero-scan-line" style={{ animationDuration: "4s" }} />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <Target className="h-6 w-6 text-pri-red" />
                <div className="data-pulse-ring" style={{ width: "32px", height: "32px", inset: "-4px" }} />
              </div>
              <h1 className="text-2xl font-bold text-white">
                National Command Center
              </h1>
              <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono ml-1">
                <span className="status-dot" />
                LIVE
              </span>
            </div>
            <p className="text-pri-silver text-sm">
              Monitoring nasional PRO RI — data real-time sebaran anggota, trainer, dan kegiatan
            </p>
          </div>
        </div>
      </div>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* KPI Cards — upgraded to glass-tech */}
      <KpiCards stats={stats} />

      {/* Target Progress */}
      <Card className="glass-tech overflow-visible">
        <div className="corner-bracket corner-bracket-tl" />
        <div className="corner-bracket corner-bracket-tr" />
        <div className="corner-bracket corner-bracket-bl" />
        <div className="corner-bracket corner-bracket-br" />
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-pri-red" />
            Target Nasional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TargetProgress stats={stats} />
        </CardContent>
      </Card>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Map Section */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-pri-red" />
            Peta Sebaran Anggota per Provinsi
          </h2>
          <ProvinceCsvExport provinces={provinces} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-3">
            <IndonesiaMap
              provinces={provinces}
              onProvinceSelect={(prov) => handleProvinceSelect(prov)}
              selectedProvinceId={mapSelectedProvince}
            />
          </div>

          {/* Side Panel */}
          <div className="xl:col-span-1">
            {drillLevel === "district" && selectedDistrict ? (
              <Card className="glass-tech border-pri-red/20 overflow-visible">
                <div className="corner-bracket corner-bracket-tl" />
                <div className="corner-bracket corner-bracket-tr" />
                <div className="corner-bracket corner-bracket-bl" />
                <div className="corner-bracket corner-bracket-br" />
                <CardContent className="p-4">
                  <DistrictDetailPanel
                    district={{
                      ...selectedDistrict,
                      regency_name: districtRegency?.name,
                    }}
                    villages={districtVillages}
                    onBack={handleBackFromDistrict}
                    onClose={handleClose}
                  />
                </CardContent>
              </Card>
            ) : drillLevel === "regency" && selectedRegency ? (
              <Card className="glass-tech border-pri-red/20 overflow-visible">
                <div className="corner-bracket corner-bracket-tl" />
                <div className="corner-bracket corner-bracket-tr" />
                <div className="corner-bracket corner-bracket-bl" />
                <div className="corner-bracket corner-bracket-br" />
                <CardContent className="p-4">
                  <RegencyDetailPanel
                    regency={{
                      ...selectedRegency,
                      province_name: regencyProvince?.name,
                    }}
                    districts={regencyDistricts}
                    onBack={handleBackFromRegency}
                    onClose={handleClose}
                    onDistrictSelect={handleDistrictSelect}
                  />
                </CardContent>
              </Card>
            ) : drillLevel === "province" && selectedProvince ? (
              <Card className="glass-tech border-pri-red/20 overflow-visible">
                <div className="corner-bracket corner-bracket-tl" />
                <div className="corner-bracket corner-bracket-tr" />
                <div className="corner-bracket corner-bracket-bl" />
                <div className="corner-bracket corner-bracket-br" />
                <CardContent className="p-4">
                  <ProvinceDetailPanel
                    province={selectedProvince}
                    regencies={provinceRegencies}
                    onClose={handleClose}
                    onRegencySelect={handleRegencySelect}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-pri-silver">
                    Top Provinsi
                  </h3>
                  <span className="text-[10px] text-pri-silver/50 font-mono">
                    {activeProvinces.length}/{provinces.length}
                  </span>
                </div>
                <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                  {topProvinces.map((prov, i) => {
                    const maxMembers = topProvinces[0]?.total_members || 1;
                    const barWidth = (prov.total_members / maxMembers) * 100;

                    // Regency count (data sudah di-preload dari Supabase)
                    const provinceRegs = regencies.filter((r) => r.province_id === prov.id);
                    const activeRegs = provinceRegs.filter((r) => r.total_members > 0).length;

                    return (
                      <button
                        key={prov.id}
                        onClick={() => handleProvinceSelect(prov)}
                        onMouseEnter={() => setHoveredProvince(prov.id)}
                        onMouseLeave={() => setHoveredProvince(null)}
                        className={`w-full p-2 rounded-lg border transition-all duration-200 text-left group ${
                          hoveredProvince === prov.id
                            ? "bg-pri-red/10 border-pri-red/30"
                            : "bg-white/5 border-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          {/* Rank badge */}
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                            i === 0
                              ? "bg-yellow-500/20 text-yellow-400"
                              : i === 1
                              ? "bg-gray-400/20 text-gray-300"
                              : i === 2
                              ? "bg-amber-600/20 text-amber-400"
                              : "bg-white/5 text-pri-silver"
                          }`}>
                            {i + 1}
                          </span>
                          <span className="text-xs text-white truncate font-medium">
                            {prov.name}
                          </span>
                          {/* Live dot */}
                          {prov.total_members > 0 && (
                            <span className="status-dot shrink-0" style={{ width: 4, height: 4 }} />
                          )}
                        </div>
                        {/* Mini progress bar */}
                        <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden ml-7">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${barWidth}%`,
                              background: i === 0
                                ? 'linear-gradient(90deg, #E31E24, #f56565)'
                                : 'linear-gradient(90deg, #E31E24, #e53e3e)'
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between ml-7 mt-1 gap-1">
                          <span className="text-[10px] font-mono text-pri-red font-bold whitespace-nowrap">
                            {prov.total_members.toLocaleString()} anggota
                          </span>
                          <div className="flex items-center gap-2 text-[8px] text-pri-silver/50 font-mono truncate">
                            {activeRegs > 0 && <span>{activeRegs} kab</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-pri-silver/40 text-center pt-1 font-mono">
                  Klik provinsi untuk lihat kab/kota, lalu klik kab/kota untuk lihat kecamatan & desa
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-tech overflow-visible">
          <div className="corner-bracket corner-bracket-tl" />
          <div className="corner-bracket corner-bracket-tr" />
          <div className="corner-bracket corner-bracket-bl" />
          <div className="corner-bracket corner-bracket-br" />
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-pri-red" />
              Pertumbuhan Anggota (Bar Chart)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthBarChart data={growth} />
          </CardContent>
        </Card>
        <Card className="glass-tech overflow-visible">
          <div className="corner-bracket corner-bracket-tl" />
          <div className="corner-bracket corner-bracket-tr" />
          <div className="corner-bracket corner-bracket-bl" />
          <div className="corner-bracket corner-bracket-br" />
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-pri-red" />
              Pertumbuhan Kumulatif (Area Chart)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthAreaChart data={growth} />
          </CardContent>
        </Card>
      </div>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Tech Distribution */}
      <Card className="glass-tech overflow-visible">
        <div className="corner-bracket corner-bracket-tl" />
        <div className="corner-bracket corner-bracket-tr" />
        <div className="corner-bracket corner-bracket-bl" />
        <div className="corner-bracket corner-bracket-br" />
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4 text-pri-red" />
            Distribusi Minat Teknologi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TechDistributionChart data={techDist} />
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-medium text-pri-silver">
                  Top 10 Minat
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-pri-red/20 to-transparent" />
              </div>
              {techDist.slice(0, 10).map((item, i) => {
                const maxCount = techDist[0]?.count || 1;
                const barWidth = (item.count / maxCount) * 100;
                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white">{item.category}</span>
                      <span className="text-pri-silver font-mono">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-pri-dark overflow-hidden progress-tech">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pri-red to-red-400"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Footer Note */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 border border-white/5">
          <span className="status-dot" />
          <p className="text-xs text-pri-silver/60 font-mono">
            Data real-time dari database
          </p>
          <span className="text-xs text-pri-silver/30 mx-1">•</span>
          <span className="text-xs text-pri-silver/40 font-mono">
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

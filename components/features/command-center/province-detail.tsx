"use client";

import { useMemo } from "react";
import { X, MapPin, Users, GraduationCap, Calendar, Lightbulb, ArrowLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProvinceStats, RegencyStats } from "@/features/command-center/data";

interface ProvinceDetailProps {
  province: ProvinceStats;
  regencies: RegencyStats[];
  onClose: () => void;
  onRegencySelect: (regency: RegencyStats) => void;
}

export function ProvinceDetailPanel({ province, regencies, onClose, onRegencySelect }: ProvinceDetailProps) {
  const sortedRegencies = useMemo(
    () => [...regencies].sort((a, b) => b.total_members - a.total_members),
    [regencies]
  );

  const totalRegencies = regencies.length;

  return (
    <div className="space-y-4">
      {/* Province Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onClose}
            className="text-xs text-pri-silver hover:text-white flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Kembali ke semua provinsi
          </button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-pri-red" />
            {province.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/5 text-pri-silver hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Province Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <DetailStat icon={Users} value={province.total_members} label="Anggota" color="text-blue-400" />
        <DetailStat icon={GraduationCap} value={province.total_trainers} label="Trainer" color="text-yellow-400" />
        <DetailStat icon={Calendar} value={province.total_events} label="Events" color="text-green-400" />
        <DetailStat icon={Lightbulb} value={province.total_innovations} label="Inovasi" color="text-orange-400" />
      </div>

      {/* Regency/City List */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">
          Kabupaten / Kota ({totalRegencies})
        </h4>

        {totalRegencies === 0 ? (
          <div className="text-center py-8 text-pri-silver text-sm">
            Belum ada data kabupaten/kota
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
            {sortedRegencies.map((regency) => {
              const maxInView = Math.max(...sortedRegencies.map((r) => r.total_members), 1);
              const barWidth = (regency.total_members / maxInView) * 100;
              return (
                <button
                  key={regency.id}
                  onClick={() => onRegencySelect(regency)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-pri-red/20 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MapPin className="h-3 w-3 text-pri-red shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-white truncate block">
                        {regency.name}
                      </span>
                      {/* Mini bar */}
                      <div className="h-1 w-full rounded-full bg-pri-dark mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-pri-red to-red-400"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[11px] font-mono text-blue-400">
                      {regency.total_members}
                    </span>
                    {regency.total_events > 0 && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                        {regency.total_events}e
                      </Badge>
                    )}
                    <ChevronRight className="h-3 w-3 text-pri-silver/30 group-hover:text-pri-silver transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailStat({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
      <Icon className={`h-4 w-4 ${color} mx-auto mb-1`} />
      <div className="text-lg font-bold text-white font-mono">{value}</div>
      <div className="text-[10px] text-pri-silver">{label}</div>
    </div>
  );
}

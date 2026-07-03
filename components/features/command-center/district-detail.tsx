"use client";

import { useMemo } from "react";
import { X, MapPin, ArrowLeft, Users, Home } from "lucide-react";
import type { DistrictStats, VillageStats } from "@/features/command-center/data";

interface DistrictDetailProps {
  district: DistrictStats & { regency_name?: string };
  villages: VillageStats[];
  onBack: () => void;
  onClose: () => void;
}

export function DistrictDetailPanel({
  district,
  villages = [],
  onBack,
  onClose,
}: DistrictDetailProps) {
  const safeVillages = villages ?? [];
  const sortedVillages = useMemo(
    () => [...safeVillages].sort((a, b) => a.name.localeCompare(b.name)),
    [safeVillages]
  );

  const totalVillages = safeVillages.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-pri-silver hover:text-white flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Kembali ke kabupaten/kota
          </button>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="h-4 w-4 text-pri-red" />
            {district.name}
          </h3>
          {district.regency_name && (
            <p className="text-[10px] text-pri-silver mt-0.5">{district.regency_name}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/5 text-pri-silver hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* District Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/5">
          <Users className="h-3.5 w-3.5 text-blue-400 mx-auto mb-1" />
          <div className="text-base font-bold text-white font-mono">{district.total_members}</div>
          <div className="text-[9px] text-pri-silver">Anggota</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/5">
          <Home className="h-3.5 w-3.5 text-green-400 mx-auto mb-1" />
          <div className="text-base font-bold text-white font-mono">{totalVillages}</div>
          <div className="text-[9px] text-pri-silver">Desa/Kelurahan</div>
        </div>
      </div>

      {/* Village List */}
      <div>
        <h4 className="text-xs font-semibold text-white mb-2.5">
          Desa / Kelurahan ({totalVillages})
        </h4>

        {totalVillages === 0 ? (
          <div className="text-center py-6 text-pri-silver text-xs">
            Belum ada data desa/kelurahan
          </div>
        ) : (
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {sortedVillages.map((village) => {
              const maxVillageMembers = Math.max(...villages.map(v => v.total_members), 1);
              const barWidth = (village.total_members / maxVillageMembers) * 100;
              return (
                <div
                  key={village.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Home className="h-3 w-3 text-pri-silver/50 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-white/80 truncate block">
                        {village.name}
                      </span>
                      {/* Mini bar */}
                      {village.total_members > 0 && (
                        <div className="h-0.5 w-full rounded-full bg-pri-dark mt-0.5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-pri-red/60"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-pri-silver shrink-0 ml-2">
                    {village.total_members > 0 ? `${village.total_members} anggota` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

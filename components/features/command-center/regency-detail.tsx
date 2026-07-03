"use client";

import { useMemo } from "react";
import { X, MapPin, ArrowLeft, Users, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RegencyStats, DistrictStats } from "@/features/command-center/data";

interface RegencyDetailProps {
  regency: RegencyStats & { province_name?: string };
  districts: DistrictStats[];
  onBack: () => void;
  onClose: () => void;
  onDistrictSelect: (district: DistrictStats) => void;
}

export function RegencyDetailPanel({
  regency,
  districts = [],
  onBack,
  onClose,
  onDistrictSelect,
}: RegencyDetailProps) {
  const safeDistricts = districts ?? [];
  const sortedDistricts = useMemo(
    () => [...safeDistricts].sort((a, b) => b.total_members - a.total_members),
    [safeDistricts]
  );

  const totalDistricts = safeDistricts.length;
  const maxMembers = Math.max(...safeDistricts.map((d) => d.total_members), 1);

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
            Kembali ke provinsi
          </button>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-pri-red" />
            {regency.name}
          </h3>
          {regency.province_name && (
            <p className="text-[10px] text-pri-silver mt-0.5">{regency.province_name}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/5 text-pri-silver hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Regency Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/5">
          <Users className="h-3.5 w-3.5 text-blue-400 mx-auto mb-1" />
          <div className="text-base font-bold text-white font-mono">{regency.total_members}</div>
          <div className="text-[9px] text-pri-silver">Anggota</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/5">
          <Building2 className="h-3.5 w-3.5 text-yellow-400 mx-auto mb-1" />
          <div className="text-base font-bold text-white font-mono">{totalDistricts}</div>
          <div className="text-[9px] text-pri-silver">Kecamatan</div>
        </div>
      </div>

      {/* District List */}
      <div>
        <h4 className="text-xs font-semibold text-white mb-2.5">
          Kecamatan ({totalDistricts})
        </h4>

        {totalDistricts === 0 ? (
          <div className="text-center py-6 text-pri-silver text-xs">
            Belum ada data kecamatan
          </div>
        ) : (
          <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
            {sortedDistricts.map((district) => {
              const barWidth =
                maxMembers > 0 ? (district.total_members / maxMembers) * 100 : 0;
              return (
                <button
                  key={district.id}
                  onClick={() => onDistrictSelect(district)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-3 w-3 text-pri-red shrink-0" />
                    <span className="text-[11px] text-white truncate">
                      {district.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <div className="w-16 h-1.5 rounded-full bg-pri-dark overflow-hidden">
                      <div
                        className="h-full rounded-full bg-pri-red"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-pri-silver">
                      {district.total_members}
                    </span>
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

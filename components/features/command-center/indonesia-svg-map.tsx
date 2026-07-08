"use client";

import { useState, useMemo, useCallback } from "react";
import { MapPin, Users, GraduationCap, Calendar, Lightbulb } from "lucide-react";
import type { ProvinceStats } from "@/features/command-center/data";

interface IndonesiaSvgMapProps {
  provinces: ProvinceStats[];
  onProvinceSelect?: (province: ProvinceStats | null) => void;
  selectedProvinceId?: string | null;
}

// Province positions (x, y) in a schematic Indonesia map layout
// x: 0-1000, y: 0-800 (SVG viewport)
// Layout approximates geographic positions
const PROVINCE_POSITIONS: Record<string, { x: number; y: number; group: string }> = {
  // === SUMATERA ===
  "Aceh": { x: 130, y: 50, group: "sumatera" },
  "Sumatera Utara": { x: 170, y: 120, group: "sumatera" },
  "Riau": { x: 210, y: 175, group: "sumatera" },
  "Kepulauan Riau": { x: 290, y: 160, group: "sumatera" },
  "Sumatera Barat": { x: 145, y: 210, group: "sumatera" },
  "Jambi": { x: 185, y: 250, group: "sumatera" },
  "Bengkulu": { x: 130, y: 300, group: "sumatera" },
  "Sumatera Selatan": { x: 210, y: 300, group: "sumatera" },
  "Kepulauan Bangka Belitung": { x: 275, y: 260, group: "sumatera" },
  "Lampung": { x: 215, y: 365, group: "sumatera" },

  // === JAWA ===
  "Banten": { x: 280, y: 410, group: "jawa" },
  "Daerah Khusus Ibukota Jakarta": { x: 330, y: 395, group: "jawa" },
  "Jawa Barat": { x: 370, y: 420, group: "jawa" },
  "Jawa Tengah": { x: 440, y: 415, group: "jawa" },
  "Daerah Istimewa Yogyakarta": { x: 460, y: 440, group: "jawa" },
  "Jawa Timur": { x: 520, y: 420, group: "jawa" },

  // === KALIMANTAN ===
  "Kalimantan Barat": { x: 315, y: 175, group: "kalimantan" },
  "Kalimantan Tengah": { x: 390, y: 210, group: "kalimantan" },
  "Kalimantan Selatan": { x: 420, y: 290, group: "kalimantan" },
  "Kalimantan Timur": { x: 470, y: 200, group: "kalimantan" },
  "Kalimantan Utara": { x: 490, y: 140, group: "kalimantan" },

  // === SULAWESI ===
  "Sulawesi Utara": { x: 610, y: 130, group: "sulawesi" },
  "Gorontalo": { x: 590, y: 180, group: "sulawesi" },
  "Sulawesi Tengah": { x: 580, y: 250, group: "sulawesi" },
  "Sulawesi Barat": { x: 540, y: 310, group: "sulawesi" },
  "Sulawesi Selatan": { x: 570, y: 360, group: "sulawesi" },
  "Sulawesi Tenggara": { x: 630, y: 340, group: "sulawesi" },

  // === NUSA TENGGARA ===
  "Bali": { x: 430, y: 480, group: "nusa" },
  "Nusa Tenggara Barat": { x: 480, y: 510, group: "nusa" },
  "Nusa Tenggara Timur": { x: 570, y: 570, group: "nusa" },

  // === MALUKU ===
  "Maluku": { x: 690, y: 370, group: "maluku" },
  "Maluku Utara": { x: 680, y: 250, group: "maluku" },

  // === PAPUA ===
  "Papua Barat": { x: 770, y: 200, group: "papua" },
  "Papua Barat Daya": { x: 750, y: 270, group: "papua" },
  "Papua Tengah": { x: 840, y: 280, group: "papua" },
  "Papua": { x: 880, y: 210, group: "papua" },
  "Papua Pegunungan": { x: 890, y: 320, group: "papua" },
  "Papua Selatan": { x: 860, y: 390, group: "papua" },
};

const GROUP_COLORS: Record<string, string> = {
  sumatera: "rgba(239, 68, 68, 0.15)",
  jawa: "rgba(59, 130, 246, 0.15)",
  kalimantan: "rgba(34, 197, 94, 0.15)",
  sulawesi: "rgba(234, 179, 8, 0.15)",
  nusa: "rgba(168, 85, 247, 0.15)",
  maluku: "rgba(249, 115, 22, 0.15)",
  papua: "rgba(236, 72, 153, 0.15)",
};

const GROUP_LABELS: Record<string, { x: number; y: number; label: string }> = {
  sumatera: { x: 160, y: 30, label: "SUMATERA" },
  jawa: { x: 380, y: 385, label: "JAWA" },
  kalimantan: { x: 390, y: 150, label: "KALIMANTAN" },
  sulawesi: { x: 580, y: 105, label: "SULAWESI" },
  nusa: { x: 500, y: 490, label: "NUSA TENGGARA" },
  maluku: { x: 710, y: 305, label: "MALUKU" },
  papua: { x: 830, y: 185, label: "PAPUA" },
};

function getColor(value: number, max: number): string {
  if (max === 0) return "#2a2a3e";
  const intensity = value / max;
  if (intensity > 0.8) return "#E31E24";
  if (intensity > 0.6) return "#d93036";
  if (intensity > 0.4) return "#b83a40";
  if (intensity > 0.2) return "#8a464a";
  if (intensity > 0.05) return "#5a4e52";
  return "#2a2a3e";
}

function getGroupBounds(positions: typeof PROVINCE_POSITIONS, group: string): { minX: number; minY: number; maxX: number; maxY: number } | null {
  const groupPositions = Object.entries(positions)
    .filter(([_, pos]) => pos.group === group)
    .map(([_, pos]) => pos);
  
  if (groupPositions.length === 0) return null;
  
  return {
    minX: Math.min(...groupPositions.map(p => p.x)) - 50,
    minY: Math.min(...groupPositions.map(p => p.y)) - 40,
    maxX: Math.max(...groupPositions.map(p => p.x)) + 50,
    maxY: Math.max(...groupPositions.map(p => p.y)) + 40,
  };
}

export function IndonesiaSvgMap({
  provinces = [],
  onProvinceSelect,
  selectedProvinceId,
}: IndonesiaSvgMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; province: ProvinceStats } | null>(null);

  const provinceMap = useMemo(() => {
    const map = new Map<string, ProvinceStats>();
    for (const p of provinces) {
      map.set(p.name.toLowerCase(), p);
      // Also add with alternate names for matching
      if (p.name === "Daerah Khusus Ibukota Jakarta") {
        map.set("dki jakarta", p);
        map.set("jakarta", p);
      }
      if (p.name === "Daerah Istimewa Yogyakarta") {
        map.set("di yogyakarta", p);
        map.set("yogyakarta", p);
        map.set("diy", p);
      }
      if (p.name === "Kepulauan Bangka Belitung") {
        map.set("bangka belitung", p);
      }
      if (p.name === "Nusa Tenggara Barat") {
        map.set("ntb", p);
      }
      if (p.name === "Nusa Tenggara Timur") {
        map.set("ntt", p);
      }
      if (p.name === "Kepulauan Riau") {
        map.set("kepri", p);
      }
    }
    return map;
  }, [provinces]);

  const maxMembers = useMemo(
    () => Math.max(...provinces.map((p) => p.total_members), 1),
    [provinces]
  );

  const provinceEntries = useMemo(
    () => Object.entries(PROVINCE_POSITIONS),
    []
  );

  const getProvince = useCallback(
    (posName: string): ProvinceStats | undefined => {
      return provinceMap.get(posName.toLowerCase().trim());
    },
    [provinceMap]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, posName: string) => {
      const stats = getProvince(posName);
      setHoveredProvince(posName);
      if (stats) {
        const svgRect = e.currentTarget.closest('svg')?.getBoundingClientRect();
        if (svgRect) {
          setTooltip({
            x: e.clientX - svgRect.left,
            y: e.clientY - svgRect.top - 10,
            province: stats,
          });
        }
      }
    },
    [getProvince]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (tooltip) {
        const svgRect = e.currentTarget.closest('svg')?.getBoundingClientRect();
        if (svgRect) {
          setTooltip({
            ...tooltip,
            x: e.clientX - svgRect.left,
            y: e.clientY - svgRect.top - 10,
          });
        }
      }
    },
    [tooltip]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredProvince(null);
    setTooltip(null);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#0a0a14] border border-white/10">
      {/* Responsive SVG */}
      <svg
        viewBox="0 0 1000 650"
        className="w-full h-auto"
        style={{ minHeight: "400px" }}
        onMouseMove={handleMouseMove}
      >
        {/* Background grid pattern */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
          </filter>
        </defs>
        <rect width="1000" height="650" fill="url(#grid)" />

        {/* Island group background zones */}
        {Object.entries(GROUP_COLORS).map(([group, color]) => {
          const bounds = getGroupBounds(PROVINCE_POSITIONS, group);
          if (!bounds) return null;
          return (
            <rect
              key={group}
              x={bounds.minX}
              y={bounds.minY}
              width={bounds.maxX - bounds.minX}
              height={bounds.maxY - bounds.minY}
              rx={12}
              fill={color}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Island group labels */}
        {Object.values(GROUP_LABELS).map(({ x, y, label }) => (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            fill="rgba(255,255,255,0.12)"
            fontSize="11"
            fontWeight="700"
            fontFamily="monospace"
            letterSpacing="3"
          >
            {label}
          </text>
        ))}

        {/* Province connection lines */}
        {Object.entries(PROVINCE_POSITIONS).map(([name, pos]) => {
          const stats = getProvince(name);
          const isHovered = hoveredProvince === name;
          const isSelected = selectedProvinceId === stats?.id;
          const hasData = (stats?.total_members ?? 0) > 0;

          // Draw lines to nearby provinces — only draw one direction (alphabetically smaller first)
          const sameGroup = Object.entries(PROVINCE_POSITIONS)
            .filter(([n, p]) => p.group === pos.group && n !== name);
          
          const nearby = sameGroup
            .map(([n, p]) => ({
              name: n,
              dist: Math.sqrt((p.x - pos.x) ** 2 + (p.y - pos.y) ** 2),
              pos: p,
            }))
            .filter(d => d.dist < 90)
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 2);

          // Only draw line if current province name sorts earlier (avoids duplicates)
          return nearby
            .filter(({ name: n }) => name.localeCompare(n) < 0)
            .map(({ name: n, pos: p }) => (
              <line
                key={`${name}-${n}`}
                x1={pos.x}
                y1={pos.y}
                x2={p.x}
                y2={p.y}
                stroke={hasData ? "rgba(227, 30, 36, 0.15)" : "rgba(255,255,255,0.05)"}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ));
        })}

        {/* Province blocks */}
        {provinceEntries.map(([name, pos]) => {
          const stats = getProvince(name);
          const isHovered = hoveredProvince === name;
          const isSelected = selectedProvinceId === stats?.id;
          const hasData = (stats?.total_members ?? 0) > 0;
          const color = stats ? getColor(stats.total_members, maxMembers) : "#2a2a3e";
          const radius = hasData ? 28 : 20;
          const displayName = name === "Daerah Khusus Ibukota Jakarta" ? "DKI Jakarta"
            : name === "Daerah Istimewa Yogyakarta" ? "DI Yogyakarta"
            : name === "Kepulauan Bangka Belitung" ? "Kep. Bangka Belitung"
            : name === "Kepulauan Riau" ? "Kep. Riau"
            : name === "Nusa Tenggara Barat" ? "NTB"
            : name === "Nusa Tenggara Timur" ? "NTT"
            : name === "Kalimantan Barat" ? "Kalbar"
            : name === "Kalimantan Tengah" ? "Kalteng"
            : name === "Kalimantan Selatan" ? "Kalsel"
            : name === "Kalimantan Timur" ? "Kaltim"
            : name === "Kalimantan Utara" ? "Kaltara"
            : name === "Sumatera Utara" ? "Sumut"
            : name === "Sumatera Barat" ? "Sumbar"
            : name === "Sumatera Selatan" ? "Sumsel"
            : name === "Sulawesi Utara" ? "Sulut"
            : name === "Sulawesi Tengah" ? "Sulteng"
            : name === "Sulawesi Selatan" ? "Sulsel"
            : name === "Sulawesi Tenggara" ? "Sultra"
            : name === "Sulawesi Barat" ? "Sulbar"
            : name === "Papua Barat Daya" ? "P. Barat Daya"
            : name === "Papua Pegunungan" ? "P. Pegunungan"
            : name;

          return (
            <g
              key={name}
              onClick={() => stats && onProvinceSelect?.(stats)}
              onMouseEnter={(e) => handleMouseEnter(e, name)}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: stats ? "pointer" : "default" }}
              filter={isHovered || isSelected ? "url(#glow)" : "url(#shadow)"}
            >
              {/* Outer ring for active provinces */}
              {(isHovered || isSelected) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius + 6}
                  fill="none"
                  stroke="rgba(227, 30, 36, 0.4)"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              )}

              {/* Pulse ring for provinces with data */}
              {hasData && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius + 3}
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                  opacity={0.3}
                >
                  {isHovered && (
                    <animate
                      attributeName="r"
                      from={radius + 3}
                      to={radius + 12}
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                  {isHovered && (
                    <animate
                      attributeName="opacity"
                      from="0.3"
                      to="0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              )}

              {/* Main circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={color}
                stroke={
                  isSelected
                    ? "#E31E24"
                    : isHovered
                    ? "rgba(227, 30, 36, 0.6)"
                    : hasData
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.1)"
                }
                strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.5}
                opacity={isHovered ? 1 : hasData ? 0.9 : 0.6}
                style={{ transition: "all 0.2s ease" }}
              />

              {/* Member count inside circle */}
              {hasData && (
                <text
                  x={pos.x}
                  y={pos.y - 2}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {stats!.total_members}
                </text>
              )}

              {/* Small label below count */}
              {hasData && (
                <text
                  x={pos.x}
                  y={pos.y + 11}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="7"
                  fontFamily="monospace"
                >
                  anggota
                </text>
              )}

              {/* Province name label below circle */}
              <text
                x={pos.x}
                y={pos.y + radius + 16}
                textAnchor="middle"
                fill={isHovered || hasData ? "white" : "rgba(255,255,255,0.3)"}
                fontSize={displayName.length > 8 ? "7" : "8"}
                fontWeight={hasData ? "600" : "400"}
                fontFamily="system-ui"
                style={{ transition: "fill 0.2s ease" }}
              >
                {displayName}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <foreignObject
              x={Math.max(10, Math.min(tooltip.x - 105, 780))}
              y={Math.max(20, Math.min(tooltip.y - 120, 500))}
              width="210"
              height="110"
            >
              <div
                className="bg-pri-carbon/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-2xl"
                style={{ 
                  boxShadow: "0 0 30px rgba(227, 30, 36, 0.15)",
                }}
              >
                <div className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-pri-red" />
                  {tooltip.province.name}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1">
                    <Users className="h-2.5 w-2.5 text-blue-400" />
                    <span className="text-[10px] text-pri-silver">Anggota:</span>
                    <span className="text-[10px] text-white font-mono font-bold">
                      {tooltip.province.total_members}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-2.5 w-2.5 text-yellow-400" />
                    <span className="text-[10px] text-pri-silver">Trainer:</span>
                    <span className="text-[10px] text-white font-mono">
                      {tooltip.province.total_trainers}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5 text-green-400" />
                    <span className="text-[10px] text-pri-silver">Events:</span>
                    <span className="text-[10px] text-white font-mono">
                      {tooltip.province.total_events}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lightbulb className="h-2.5 w-2.5 text-orange-400" />
                    <span className="text-[10px] text-pri-silver">Inovasi:</span>
                    <span className="text-[10px] text-white font-mono">
                      {tooltip.province.total_innovations}
                    </span>
                  </div>
                </div>
              </div>
            </foreignObject>
          </g>
        )}

        {/* Legend */}
        <g transform="translate(20, 580)">
          <rect x="0" y="0" width="960" height="55" rx="8" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.05)" />
          
          {/* Color scale */}
          <text x="15" y="20" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">Heatmap:</text>
          
          {[
            { color: "#2a2a3e", label: "0" },
            { color: "#5a4e52", label: "Rendah" },
            { color: "#8a464a", label: "Sedang" },
            { color: "#b83a40", label: "Tinggi" },
            { color: "#d93036", label: "Sangat Tinggi" },
            { color: "#E31E24", label: "Maksimal" },
          ].map((item, i) => (
            <g key={i} transform={`translate(${80 + i * 75}, 10)`}>
              <rect x="0" y="0" width="12" height="12" rx="2" fill={item.color} stroke="rgba(255,255,255,0.1)" />
              <text x="17" y="10" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">{item.label}</text>
            </g>
          ))}

          <text x="15" y="42" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
            Klik provinsi untuk detail → klik kab/kota → klik kecamatan
          </text>
          <text x="750" y="42" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">
            Data real-time dari database • {new Date().toLocaleDateString("id-ID")}
          </text>
        </g>
      </svg>

      {/* Mobile fallback text */}
      {provinces.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-pri-silver/50">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Memuat data provinsi...</p>
          </div>
        </div>
      )}
    </div>
  );
}

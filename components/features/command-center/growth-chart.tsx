"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyGrowth } from "@/features/command-center/data";

interface GrowthChartProps {
  data: MonthlyGrowth[];
}

const monthNames: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "Mei",
  "06": "Jun",
  "07": "Jul",
  "08": "Agu",
  "09": "Sep",
  "10": "Okt",
  "11": "Nov",
  "12": "Des",
};

function formatMonth(month: string) {
  const [, m] = month.split("-");
  return monthNames[m] || month;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-pri-carbon border border-white/10 rounded-lg p-3 shadow-xl text-sm">
      <p className="text-pri-silver mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-white font-mono">
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export function GrowthAreaChart({ data }: GrowthChartProps) {
  const chartData = data.map((d) => ({
    month: formatMonth(d.month),
    "Anggota Baru": d.new_members,
    Kumulatif: d.cumulative,
  }));

  return (
    <div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="newMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E31E24" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E31E24" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}
            />
            <Area
              type="monotone"
              dataKey="Anggota Baru"
              stroke="#E31E24"
              fill="url(#newMembers)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Kumulatif"
              stroke="#3b82f6"
              fill="url(#cumulative)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function GrowthBarChart({ data }: GrowthChartProps) {
  const chartData = data.map((d) => ({
    month: formatMonth(d.month),
    "Anggota Baru": d.new_members,
  }));

  return (
    <div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="Anggota Baru"
              fill="#E31E24"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TechDistributionChart({
  data,
}: {
  data: { category: string; count: number }[];
}) {
  return (
    <div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.slice(0, 10)}
            layout="vertical"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              type="number"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="category"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#E31E24"
              radius={[0, 4, 4, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

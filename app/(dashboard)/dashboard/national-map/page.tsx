import { createClient } from "@/lib/supabase/server";
import { IndonesiaMap } from "@/components/features/command-center/indonesia-map";
import { Map, Users, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

async function getMapData() {
  const supabase = await createClient();

  const [{ data: provinces }, { data: regencies }] = await Promise.all([
    supabase
      .from("provinces")
      .select("id, name, code, capital, latitude, longitude, total_members, total_trainers, total_mentors, total_events, total_innovations, created_at")
      .order("total_members", { ascending: false }),
    supabase
      .from("regencies")
      .select("id, name, province_id, code, latitude, longitude, total_members, total_trainers, total_events, total_innovations, created_at"),
  ]);

  return {
    provinces: provinces ?? [],
    regencies: regencies ?? [],
  };
}

export default async function DashboardNationalMapPage() {
  const { provinces, regencies } = await getMapData();

  const totalMembers = provinces.reduce((sum, p) => sum + (p.total_members || 0), 0);
  const activeProvinces = provinces.filter((p) => p.total_members > 0).length;
  const totalTrainers = provinces.reduce((sum, p) => sum + (p.total_trainers || 0), 0);
  const totalEvents = provinces.reduce((sum, p) => sum + (p.total_events || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full bg-pri-red/20 flex items-center justify-center">
              <Map className="h-6 w-6 text-pri-red" />
            </div>
            <div className="data-pulse-ring rounded-full" />
            <div className="data-pulse-ring rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Peta Nasional</h1>
              <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
                <span className="status-dot" />
                LIVE
              </span>
            </div>
            <p className="text-sm text-pri-silver">
              Visualisasi interaktif sebaran anggota &amp; statistik nasional
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-pri-red/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-pri-red" />
              </div>
              <div>
                <p className="text-xs text-pri-silver">Total Anggota</p>
                <p className="text-lg font-bold text-white">{totalMembers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Map className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-pri-silver">Provinsi Aktif</p>
                <p className="text-lg font-bold text-white">{activeProvinces}/{provinces.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-pri-silver">Trainer</p>
                <p className="text-lg font-bold text-white">{totalTrainers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-pri-silver">Total Event</p>
                <p className="text-lg font-bold text-white">{totalEvents.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <div>
        <p className="text-xs text-pri-silver/60 mb-3 font-mono">
          Klik provinsi pada peta untuk melihat detail
        </p>
        <IndonesiaMap
          provinces={provinces as any}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 text-xs text-pri-silver">
        <div className="flex items-center gap-2">
          <span className="text-[10px]">Warna provinsi:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#3d3d4a]" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#7a686a]" />
            <span>Rendah</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#c9444a]" />
            <span>Sedang</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#E31E24]" />
            <span>Tinggi</span>
          </div>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <span>Ukuran lingkaran = jumlah anggota per provinsi</span>
      </div>
    </div>
  );
}

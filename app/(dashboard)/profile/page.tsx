import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import { User, MapPin, Briefcase, Calendar, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  return member;
}

async function getRegions() {
  const supabase = await createClient();
  const [provinces, regencies, districts, villages] = await Promise.all([
    supabase.from("provinces").select("id, name").order("name"),
    supabase.from("regencies").select("id, name, province_id").order("name"),
    supabase.from("districts").select("id, name, regency_id").order("name"),
    supabase.from("villages").select("id, name, district_id").order("name"),
  ]);

  return {
    provinces: provinces ?? [],
    regencies: regencies ?? [],
    districts: districts ?? [],
    villages: villages ?? [],
  };
}

export default async function ProfilePage() {
  const [member, regions] = await Promise.all([
    getProfile(),
    getRegions(),
  ]);

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <User className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
          <p className="text-pri-silver">Silakan login terlebih dahulu</p>
        </div>
      </div>
    );
  }

  // Get province/regency names for display
  const provinceName = member.province_id
    ? (regions as any).provinces?.find((p: any) => p.id === member.province_id)?.name
    : null;
  const regencyName = member.regency_id
    ? (regions as any).regencies?.find((r: any) => r.id === member.regency_id)?.name
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
              <span className="status-dot" />
              PROFIL SAYA
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 rounded-full bg-pri-red/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-pri-red">
                {member.full_name?.charAt(0) || "?"}
              </span>
              <div className="data-pulse-ring rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{member.full_name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-pri-silver mt-1">
                <span className="font-mono">{member.member_id}</span>
                {member.occupation && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {member.occupation}
                  </span>
                )}
                {provinceName && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {provinceName}{regencyName ? `, ${regencyName}` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileForm member={member as any} regions={regions as any} />
    </div>
  );
}

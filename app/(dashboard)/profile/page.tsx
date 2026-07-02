import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("members")
    .select("*, province_id!inner(name), regency_id!inner(name)")
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
    return <div className="text-center text-pri-silver py-12">Silakan login terlebih dahulu</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profil Saya</h1>
        <p className="text-pri-silver mt-1">Kelola informasi profil Anda</p>
      </div>

      <ProfileForm member={member as any} regions={regions as any} />
    </div>
  );
}

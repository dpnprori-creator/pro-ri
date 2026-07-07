import { createClient } from "@/lib/supabase/server";
import { InnovationsManager } from "./innovations-manager";

async function getInnovations() {
  const supabase = await createClient();
  const [innovations, provinces] = await Promise.all([
    supabase
      .from("innovations")
      .select("id, title, slug, category, year, status, province_id(name), creator_id(full_name)")
      .order("created_at", { ascending: false }),
    supabase.from("provinces").select("id, name").order("name"),
  ]);

  return {
    innovations: innovations.data ?? [],
    provinces: provinces.data ?? [],
  };
}

export default async function AdminInnovationsPage() {
  const { innovations, provinces } = await getInnovations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Inovasi</h1>
        <p className="text-pri-silver mt-1">Total {innovations.length} inovasi</p>
      </div>

      <InnovationsManager {...({ innovations, provinces } as any)} />
    </div>
  );
}

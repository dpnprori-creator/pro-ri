import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardInnovationsClient } from "@/components/features/dashboard/dashboard-innovations-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

async function getInnovations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return [];

  const { data } = await supabase
    .from("innovations")
    .select("id, title, slug, category, year, status, description, province_id(name), creator_id(full_name)")
    .eq("creator_id", member.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function DashboardInnovationsPage() {
  const innovations = await getInnovations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inovasi Saya</h1>
          <p className="text-pri-silver mt-1">{innovations.length} inovasi</p>
        </div>
        <Link href="/dashboard/innovations/new">
          <Button className="bg-pri-red hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Buat Inovasi Baru
          </Button>
        </Link>
      </div>

      <DashboardInnovationsClient innovations={innovations as any} />
    </div>
  );
}

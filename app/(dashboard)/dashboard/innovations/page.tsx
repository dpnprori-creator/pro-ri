import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardInnovationsClient } from "@/components/features/dashboard/dashboard-innovations-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Lightbulb } from "lucide-react";

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

  const statusCounts = {
    draft: innovations.filter((i) => i.status === "draft").length,
    published: innovations.filter((i) => i.status === "published").length,
    featured: innovations.filter((i) => i.status === "featured").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
                  <span className="status-dot" />
                  INOVASI SAYA
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white">Inovasi Saya</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-pri-silver text-sm">{innovations.length} inovasi</p>
                {statusCounts.published > 0 && (
                  <Badge variant="success" className="text-[10px]">
                    {statusCounts.published} published
                  </Badge>
                )}
                {statusCounts.draft > 0 && (
                  <Badge variant="warning" className="text-[10px]">
                    {statusCounts.draft} draft
                  </Badge>
                )}
                {statusCounts.featured > 0 && (
                  <Badge variant="default" className="text-[10px]">
                    {statusCounts.featured} featured
                  </Badge>
                )}
              </div>
            </div>
            <Link href="/dashboard/innovations/new">
              <Button className="bg-pri-red hover:bg-red-700 flex-shrink-0 ml-4">
                <Plus className="h-4 w-4 mr-2" />
                Buat Inovasi Baru
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <DashboardInnovationsClient innovations={innovations as any} />
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { MemberDirectoryClient } from "./member-directory-client";
import { Users } from "lucide-react";

async function getMembers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("id, full_name, member_id, occupation, status, province_id(name)")
    .order("full_name", { ascending: true });

  return data ?? [];
}

export default async function MembersPage() {
  const members = await getMembers();
  const activeMembers = members.filter((m) => m.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
              <span className="status-dot" />
              DIREKTORI ANGGOTA
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Direktori Anggota</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-pri-silver text-sm">Total {members.length} anggota</p>
            <span className="text-[10px] text-pri-silver/40 font-mono">|</span>
            <p className="text-pri-silver text-sm">
              <span className="text-green-400 font-semibold">{activeMembers}</span> aktif
            </p>
          </div>
        </div>
      </div>

      <MemberDirectoryClient members={members as any} />
    </div>
  );
}

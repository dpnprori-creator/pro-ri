import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MemberDetail } from "./member-detail";

async function getMember(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("*, role_id!inner(name), province_id!inner(name), regency_id!inner(name)")
    .eq("id", id)
    .single();

  return data;
}

export default async function MemberDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const member = await getMember(id);

  if (!member) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Detail Member</h1>
        <p className="text-pri-silver mt-1">{member.full_name}</p>
      </div>

      <MemberDetail member={member} />
    </div>
  );
}

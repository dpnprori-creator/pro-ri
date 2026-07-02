import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { MemberCardView } from "@/components/features/membership/member-card-view";

async function getMember(memberNumber: string) {
  const supabase = createAdminClient();

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("member_id", memberNumber)
    .single();

  if (!member) return null;

  const { data: card } = await supabase
    .from("member_cards")
    .select("*")
    .eq("user_id", member.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { member, card };
}

export default async function VerifyMemberPage(props: { params: Promise<{ memberNumber: string }> }) {
  const { memberNumber } = await props.params;
  const data = await getMember(memberNumber);

  if (!data) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Verifikasi Anggota</h1>
        <p className="text-pri-silver mt-1">Nomor anggota: {memberNumber}</p>
      </div>

      <MemberCardView card={data.card as any ?? undefined} />
    </div>
  );
}

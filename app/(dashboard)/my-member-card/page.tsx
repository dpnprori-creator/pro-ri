import { createClient } from "@/lib/supabase/server";
import { MemberCardView } from "@/components/features/membership/member-card-view";

async function getMemberCard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { member: null, card: null };

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { member: null, card: null };

  const { data: card } = await supabase
    .from("member_cards")
    .select("*")
    .eq("user_id", member.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { member, card };
}

export default async function MyMemberCardPage() {
  const { member, card } = await getMemberCard();

  if (!member) {
    return <div className="text-center text-pri-silver py-12">Silakan login terlebih dahulu</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Kartu Anggota</h1>
        <p className="text-pri-silver mt-1">Kartu identitas anggota PRO RI</p>
      </div>

      <MemberCardView card={card as any ?? undefined} />
    </div>
  );
}

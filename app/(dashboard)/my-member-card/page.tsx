import { createClient } from "@/lib/supabase/server";
import { MemberCardView } from "@/components/features/membership/member-card-view";
import { CreditCard } from "lucide-react";

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

  // Note: member_cards.user_id references auth.users(id), not members(id)
  const { data: card } = await supabase
    .from("member_cards")
    .select("*")
    .eq("user_id", user.id)
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

      {card ? (
        <MemberCardView card={card as any} />
      ) : (
        <div className="text-center py-20 glass-card rounded-xl">
          <CreditCard className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
          <p className="text-pri-silver">Belum ada kartu anggota</p>
          <p className="text-xs text-pri-silver/60 mt-1">
            Kartu anggota akan tersedia setelah diverifikasi oleh admin
          </p>
        </div>
      )}
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { MemberCardView } from "@/components/features/membership/member-card-view";
import { MemberRegistrationForm } from "@/components/features/membership/member-registration-form";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

async function getMemberCardData() {
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
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { member, card, userEmail: user.email };
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: "Menunggu Verifikasi",
    color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-300",
    icon: <Clock className="h-4 w-4" />,
  },
  approved: {
    label: "Kartu Aktif",
    color: "bg-green-500/10 border-green-500/20 text-green-300",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  rejected: {
    label: "Ditolak",
    color: "bg-red-500/10 border-red-500/20 text-red-300",
    icon: <AlertCircle className="h-4 w-4" />,
  },
};

export default async function MyMemberCardPage() {
  const { member, card, userEmail } = await getMemberCardData();

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <CreditCard className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
          <p className="text-pri-silver">Silakan login terlebih dahulu</p>
        </div>
      </div>
    );
  }

  // Determine card status
  const cardExists = !!card;
  const cardStatus = card?.status as string | undefined;
  const statusInfo = cardStatus ? statusConfig[cardStatus] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
              <span className="status-dot" />
              KARTU ANGGOTA
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Kartu Anggota PRO RI
          </h1>
          <p className="text-pri-silver text-sm mt-1">
            {cardStatus === "approved"
              ? "Kartu identitas resmi anggota Pusat Robotika Rakyat Indonesia"
              : "Lengkapi data diri untuk mendapatkan kartu anggota resmi"}
          </p>
        </div>
      </div>

      {/* Status Banner (if card exists) */}
      {cardExists && statusInfo && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${statusInfo.color}`}
        >
          {statusInfo.icon}
          <div className="flex-1">
            <p className="text-sm font-medium">{statusInfo.label}</p>
            {cardStatus === "rejected" && card?.rejection_reason && (
              <p className="text-xs mt-0.5 opacity-80">
                Alasan: {card.rejection_reason}
              </p>
            )}
          </div>
          <Badge
            variant={
              cardStatus === "approved"
                ? "success"
                : cardStatus === "pending"
                  ? "warning"
                  : "danger"
            }
            className="text-[10px]"
          >
            {statusInfo.label}
          </Badge>
        </div>
      )}

      {/* Content — Card View or Registration Form */}
      {cardStatus === "approved" && card ? (
        <MemberCardView card={card as any} />
      ) : (
        <MemberRegistrationForm
          existingCard={
            card
              ? ({
                  id: card.id,
                  status: card.status,
                  rejection_reason: card.rejection_reason,
                  full_name: card.full_name || member.full_name,
                  nickname: card.nickname,
                  family_count: card.family_count,
                  gender: card.gender,
                  birth_place: card.birth_place,
                  birth_date: card.birth_date,
                  religion: card.religion,
                  nik: card.nik,
                  npwp: card.npwp,
                  email: card.email || userEmail,
                  phone: card.phone || member.phone || "",
                  address: card.address,
                  postal_code: card.postal_code,
                  education: card.education,
                  occupation: card.occupation || member.occupation,
                  interests: card.interests,
                  skills: card.skills,
                  experience: card.experience,
                  motivation: card.motivation,
                  photo_url: card.photo_url,
                  signature_url: card.signature_url,
                } as any)
              : null
          }
          userEmail={userEmail}
        />
      )}
    </div>
  );
}

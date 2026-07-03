import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MemberCardView } from "@/components/features/membership/member-card-view";
import { MemberRegistrationForm } from "@/components/features/membership/member-registration-form";
import {
  CreditCard,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getMembershipData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { member: null, card: null, certificates: [] };

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { member: null, card: null, certificates: [] };

  const [{ data: card }, { data: certificates }] = await Promise.all([
    supabase
      .from("member_cards")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("certificates")
      .select("*")
      .eq("member_id", member.id)
      .order("issued_at", { ascending: false }),
  ]);

  return { member, card, certificates: certificates ?? [] };
}

export default async function MembershipPage() {
  const { member, card, certificates } = await getMembershipData();

  if (!member) {
    redirect("/login");
  }

  const cardStatus = card?.status as string | undefined;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
              <span className="status-dot" />
              MEMBERSHIP
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Keanggotaan</h1>
          <p className="text-pri-silver text-sm mt-1">
            Kelola kartu anggota dan sertifikat PRO RI Anda
          </p>
        </div>
      </div>

      {/* Kartu Anggota Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-pri-red" />
            <h2 className="text-lg font-semibold text-white">Kartu Anggota</h2>
          </div>
          {cardStatus && (
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
              {cardStatus === "approved"
                ? "Aktif"
                : cardStatus === "pending"
                  ? "Menunggu Verifikasi"
                  : "Ditolak"}
            </Badge>
          )}
        </div>

        {cardStatus === "approved" && card ? (
          <MemberCardView card={card as any} />
        ) : (
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              {!card ? (
                <>
                  <CreditCard className="h-12 w-12 text-pri-silver/30 mx-auto mb-4" />
                  <p className="text-pri-silver font-medium mb-2">
                    Belum Ada Kartu Anggota
                  </p>
                  <p className="text-xs text-pri-silver/60 mb-6 max-w-md mx-auto">
                    Daftar kartu anggota untuk mendapatkan identitas resmi PRO RI.
                    Setelah diverifikasi admin, kartu digital dapat diunduh dan dicetak.
                  </p>
                  <Link href="/my-member-card">
                    <Button className="bg-pri-red hover:bg-red-700">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Daftar Kartu Anggota
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {cardStatus === "pending" ? (
                    <Clock className="h-12 w-12 text-yellow-400/50 mx-auto mb-4" />
                  ) : (
                    <AlertCircle className="h-12 w-12 text-red-400/50 mx-auto mb-4" />
                  )}
                  <p className="text-pri-silver font-medium mb-2">
                    {cardStatus === "pending"
                      ? "Menunggu Verifikasi Admin"
                      : "Data Ditolak"}
                  </p>
                  <p className="text-xs text-pri-silver/60 mb-6 max-w-md mx-auto">
                    {cardStatus === "pending"
                      ? "Data kartu anggota Anda sedang direview oleh admin PRO RI."
                      : `Data kartu ditolak. ${card?.rejection_reason ? `Alasan: ${card.rejection_reason}` : ""} Silakan perbaiki dan kirim ulang.`}
                  </p>
                  <Link href="/my-member-card">
                    <Button className="bg-pri-red hover:bg-red-700">
                      <CreditCard className="h-4 w-4 mr-2" />
                      {cardStatus === "pending" ? "Lihat Status" : "Perbaiki Data"}
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </section>

      {/* Sertifikat Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-pri-red" />
            <h2 className="text-lg font-semibold text-white">Sertifikat</h2>
          </div>
          <Badge variant="outline" className="text-[10px] border-white/10 text-pri-silver font-mono">
            {certificates.length} sertifikat
          </Badge>
        </div>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {certificates.map((cert) => (
              <Card key={cert.id} className="glass-card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-pri-red/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-pri-red" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {cert.title}
                      </p>
                      <p className="text-[10px] text-pri-silver font-mono mt-0.5">
                        {cert.type}
                      </p>
                      {cert.issued_at && (
                        <p className="text-[10px] text-pri-silver/60 mt-0.5">
                          {new Date(cert.issued_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    {cert.pdf_url && (
                      <a
                        href={cert.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-pri-silver hover:text-pri-red transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-pri-silver/30 mx-auto mb-4" />
              <p className="text-pri-silver font-medium mb-2">
                Belum Ada Sertifikat
              </p>
              <p className="text-xs text-pri-silver/60 max-w-md mx-auto">
                Sertifikat akan muncul setelah Anda menyelesaikan event, program, atau pelatihan PRO RI.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

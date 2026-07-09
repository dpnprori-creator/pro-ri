import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMyCourseCertificates } from "@/features/academy/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function CourseCertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/academy/login");

  const certificates = await getMyCourseCertificates();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back */}
      <Link
        href="/academy/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-pri-silver hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-10 w-10 rounded-xl bg-pri-red/10 flex items-center justify-center">
          <Award className="h-5 w-5 text-pri-red" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Sertifikat Saya</h1>
          <p className="text-xs text-pri-silver/60">
            {certificates.length > 0
              ? `${certificates.length} sertifikat kelulusan kursus`
              : "Belum ada sertifikat"}
          </p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-20 glass-card border-white/5">
          <div className="h-16 w-16 rounded-full bg-pri-red/5 flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-pri-red/30" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Belum Ada Sertifikat</h2>
          <p className="text-sm text-pri-silver/40 mb-6 max-w-md mx-auto">
            Selesaikan kursus untuk mendapatkan sertifikat kelulusan digital dari PRO RI.
          </p>
          <Link href="/academy/courses">
            <Button className="bg-pri-red hover:bg-red-700 text-white">
              Lihat Kursus Tersedia
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => {
            const course = cert.courses as unknown as {
              title: string; slug: string; category: string; level: string;
              total_lessons: number; duration_hours: number; image_url: string | null;
            };

            return (
              <div
                key={cert.id}
                className="glass-card border border-white/5 hover:border-pri-red/20 transition-all duration-300 overflow-hidden group"
              >
                {/* Top accent */}
                <div className="h-0.5 bg-gradient-to-r from-pri-red to-red-400 w-0 group-hover:w-full transition-all duration-500" />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className={cn(
                          "h-4 w-4",
                          cert.verified ? "text-green-400" : "text-yellow-400"
                        )} />
                        <span className={cn(
                          "text-[10px] font-mono tracking-wider",
                          cert.verified ? "text-green-400" : "text-yellow-400"
                        )}>
                          {cert.verified ? "TERVERIFIKASI" : "BELUM DIVERIFIKASI"}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1">
                        {course?.title || "Kursus"}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-pri-silver/40 font-mono">
                        <span>{cert.certificate_number}</span>
                        <span>·</span>
                        <span>{new Date(cert.issued_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric",
                        })}</span>
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/academy/certificates/${cert.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-pri-red/10 text-pri-red rounded-lg hover:bg-pri-red/20 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Lihat
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

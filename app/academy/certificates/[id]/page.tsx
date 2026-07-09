import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCourseCertificate } from "@/features/academy/actions";
import { CourseCertificateDetailClient } from "./certificate-detail-client";

export default async function CourseCertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/academy/login");

  const certificate = await getCourseCertificate(id);
  if (!certificate) notFound();

  // Verify ownership
  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member || certificate.member_id !== member.id) {
    // Allow access if admin
    const { data: memberCheck } = await supabase
      .from("members")
      .select("role_id(name)")
      .eq("auth_id", user.id)
      .single();
    const roleObj = memberCheck?.role_id as { name: string } | null;
    if (roleObj?.name !== "admin" && roleObj?.name !== "super_admin") {
      notFound();
    }
  }

  const certData = {
    id: certificate.id,
    certificate_number: certificate.certificate_number,
    course_id: certificate.course_id,
    member_id: certificate.member_id,
    issued_at: certificate.issued_at,
    verified: certificate.verified,
    courses: certificate.courses as unknown as {
      title: string; slug: string; category: string; level: string;
      total_lessons: number; duration_hours: number; image_url: string | null;
    },
    members: certificate.members as unknown as {
      full_name: string; member_id: string;
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back */}
      <Link
        href="/academy/certificates"
        className="inline-flex items-center gap-1.5 text-xs text-pri-silver hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Sertifikat Saya
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-pri-red/10 flex items-center justify-center">
          <Award className="h-5 w-5 text-pri-red" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Sertifikat Kelulusan</h1>
          <p className="text-xs text-pri-silver/60">{certData.courses.title}</p>
        </div>
      </div>

      {/* Certificate Detail Client */}
      <CourseCertificateDetailClient data={certData} />
    </div>
  );
}

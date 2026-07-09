"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, BookOpen, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCertificatePDF, CourseCertificatePrintView } from "@/components/features/academy/course-certificate-pdf";

interface CourseCertificateData {
  id: string;
  certificate_number: string;
  course_id: string;
  member_id: string;
  issued_at: string;
  verified: boolean;
  courses: {
    title: string;
    slug: string;
    category: string;
    level: string;
    total_lessons: number;
    duration_hours: number;
    image_url: string | null;
  };
  members: {
    full_name: string;
    member_id: string;
  };
}

const levelLabels: Record<string, string> = {
  beginner: "Pemula", intermediate: "Menengah", advanced: "Mahir", all: "Semua Level",
};

const categoryLabels: Record<string, string> = {
  ai: "AI", programming: "Programming", robotik: "Robotik", robotics: "Robotika",
  iot: "IoT", technology: "Teknologi", other: "Lainnya",
};

export function CourseCertificateDetailClient({ data }: { data: CourseCertificateData }) {
  const course = data.courses;
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-8">
      {/* Certificate Status Card */}
      <div className="glass-card border border-white/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
            data.verified ? "bg-green-500/10" : "bg-yellow-500/10"
          }`}>
            <ShieldCheck className={`h-5 w-5 ${
              data.verified ? "text-green-400" : "text-yellow-400"
            }`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {data.verified ? "Sertifikat Terverifikasi" : "Sertifikat Belum Diverifikasi"}
            </p>
            <p className="text-[10px] text-pri-silver/40 font-mono">
              {data.certificate_number}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] text-pri-silver/40 font-mono uppercase tracking-wider mb-1">Nama</p>
            <p className="text-sm text-white">{data.members.full_name}</p>
          </div>
          <div>
            <p className="text-[10px] text-pri-silver/40 font-mono uppercase tracking-wider mb-1">Member ID</p>
            <p className="text-sm text-white font-mono">{data.members.member_id}</p>
          </div>
          <div>
            <p className="text-[10px] text-pri-silver/40 font-mono uppercase tracking-wider mb-1">Tanggal Terbit</p>
            <p className="text-sm text-white">{new Date(data.issued_at).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric",
            })}</p>
          </div>
          <div>
            <p className="text-[10px] text-pri-silver/40 font-mono uppercase tracking-wider mb-1">Kursus</p>
            <p className="text-sm text-white">{course.title}</p>
          </div>
          <div>
            <p className="text-[10px] text-pri-silver/40 font-mono uppercase tracking-wider mb-1">Kategori</p>
            <p className="text-sm text-white">{categoryLabels[course.category] || course.category}</p>
          </div>
          <div>
            <p className="text-[10px] text-pri-silver/40 font-mono uppercase tracking-wider mb-1">Level</p>
            <p className="text-sm text-white">{levelLabels[course.level] || course.level}</p>
          </div>
        </div>

        {/* Course stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] text-pri-silver/40 font-mono">
            <BookOpen className="h-3 w-3" />
            {course.total_lessons} pelajaran
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-pri-silver/40 font-mono">
            <Clock className="h-3 w-3" />
            {course.duration_hours} jam
          </div>
          <Link
            href={`/academy/courses/${course.slug}`}
            className="inline-flex items-center gap-1 text-[10px] text-pri-red hover:text-red-400 transition-colors ml-auto"
          >
            Lihat Kursus <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Download / Preview Buttons */}
      <div className="glass-card border border-white/5 p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Download Sertifikat</h2>
        <p className="text-xs text-pri-silver/60 mb-4">
          Unduh sertifikat dalam format PDF yang siap dicetak.
        </p>

        <CourseCertificatePDF data={data} />

        {!showPreview && (
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="w-full mt-3 border-white/10 text-pri-silver hover:text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Tampilkan Preview
          </Button>
        )}
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="glass-card border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Preview Sertifikat</h2>
            <button
              onClick={() => setShowPreview(false)}
              className="text-[10px] text-pri-silver/40 hover:text-white transition-colors"
            >
              Sembunyikan
            </button>
          </div>
          <div className="flex justify-center overflow-x-auto">
            <CourseCertificatePrintView data={data} />
          </div>
        </div>
      )}

      {/* Verification info */}
      <div className="text-center">
        <p className="text-[10px] text-pri-silver/30">
          Sertifikat ini dapat diverifikasi di halaman verifikasi PRO RI
        </p>
      </div>
    </div>
  );
}

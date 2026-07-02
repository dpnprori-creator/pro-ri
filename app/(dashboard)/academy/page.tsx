import Link from "next/link";
import { GraduationCap, ExternalLink, BookOpen, Users, Award, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ACADEMY_URL } from "@/lib/constants";

const features = [
  {
    icon: BookOpen,
    title: "Kurikulum Terstruktur",
    description: "Materi pembelajaran robotika, AI, IoT, dan programming yang dirancang oleh para ahli",
  },
  {
    icon: Users,
    title: "Mentor Berpengalaman",
    description: "Belajar langsung dari trainer dan mentor bersertifikat nasional",
  },
  {
    icon: Award,
    title: "Sertifikat Kompetensi",
    description: "Dapatkan sertifikat digital setelah menyelesaikan setiap program",
  },
  {
    icon: Trophy,
    title: "Project-Based Learning",
    description: "Praktek langsung dengan proyek-proyek teknologi nyata",
  },
];

export default function AcademyPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Akademi Teknologi</h1>
        <p className="text-pri-silver mt-1">
          Platform pembelajaran digital PRO RI
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((f, i) => (
          <Card key={f.title} className="glass-card-hover p-5">
            <CardContent className="p-0">
              <div className="h-10 w-10 rounded-lg bg-pri-red/10 flex items-center justify-center mb-3">
                <f.icon className="h-5 w-5 text-pri-red" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-pri-silver leading-relaxed">{f.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="glass-card overflow-hidden border-2 border-white/10">
        <div className="bg-gradient-to-r from-pri-red to-red-700 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 rounded-full border-8 border-white" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full border-8 border-white" />
          </div>
          <div className="relative z-10">
            <GraduationCap className="h-10 w-10 text-white mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Mulai Belajar Sekarang</h2>
            <p className="text-white/70 text-sm max-w-md mx-auto mb-4">
              Akses materi pembelajaran eksklusif dan tingkatkan kompetensi teknologi Anda
            </p>
            <Link href={ACADEMY_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="bg-white text-pri-red hover:bg-white/90 px-8">
                Kunjungi Academy <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

import Link from "next/link";
import {
  GraduationCap, BookOpen, Bot, Cpu, 
  CircuitBoard, Code, Rocket, Award,
  ArrowRight, CheckCircle, Users, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AcademyFeaturedCourses } from "@/components/features/academy/academy-featured-courses";

const features = [
  {
    icon: BookOpen,
    title: "Kurikulum Terstruktur",
    description: "Materi pembelajaran dari dasar hingga mahir, dirancang oleh para ahli di bidangnya.",
  },
  {
    icon: Bot,
    title: "Project-Based Learning",
    description: "Belajar sambil membangun proyek nyata yang bisa ditambahkan ke portfolio.",
  },
  {
    icon: Award,
    title: "Sertifikat Kompetensi",
    description: "Dapatkan sertifikat digital setelah menyelesaikan setiap learning path.",
  },
  {
    icon: Users,
    title: "Mentor Berpengalaman",
    description: "Belajar langsung dari trainer dan mentor bersertifikat dari seluruh Indonesia.",
  },
];

const learningPaths = [
  {
    title: "Kecerdasan Buatan (AI)",
    description: "Dari AI Fundamental hingga Generative AI",
    icon: Bot,
    color: "from-purple-600 to-pink-600",
    lessons: "20+",
    courses: [
      "AI Fundamental", "Prompt Engineering", "Generative AI",
      "AI Automation", "AI Project"
    ],
  },
  {
    title: "Programming",
    description: "Dari HTML hingga Full Stack Development",
    icon: Code,
    color: "from-blue-600 to-cyan-600",
    lessons: "25+",
    courses: [
      "HTML & CSS", "JavaScript", "Node.js",
      "Database", "Deployment"
    ],
  },
  {
    title: "Robotika",
    description: "Dasar robotika hingga sistem cerdas",
    icon: Cpu,
    color: "from-pri-red to-red-700",
    lessons: "15+",
    courses: [
      "Elektronika Dasar", "Mikrokontroler", "Robotika",
      "Computer Vision", "IoT"
    ],
  },
];

export default function AcademyLandingPage() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Tech background */}
        <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
        <div className="absolute inset-0 circuit-pattern opacity-[0.03]" />
        <div className="absolute top-20 -left-20 w-80 h-80 bg-pri-red/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pri-red/10 border border-pri-red/20 text-xs text-pri-red mb-6 font-mono tracking-wider">
              <Sparkles className="h-3 w-3" />
              LEARNING ECOSYSTEM v1.0
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Bentuk Masa Depanmu dengan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pri-red to-red-400">
                Teknologi
              </span>
            </h1>

            <p className="text-lg text-pri-silver/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              Platform belajar teknologi untuk talenta Indonesia. 
              Kuasai robotika, AI, programming, dan IoT — 
              dari dasar hingga mahir, dengan learning path terstruktur dan mentor berpengalaman.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/academy/courses">
                <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-8 text-base">
                  Mulai Belajar <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/academy/courses?view=path">
                <Button size="lg" variant="outline" className="border-white/20 text-pri-silver hover:text-white px-8 text-base">
                  Lihat Learning Path
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
              {[
                { value: "6+", label: "Learning Path" },
                { value: "50+", label: "Materi" },
                { value: "GRATIS", label: "Untuk Anggota" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-white font-mono">{stat.value}</div>
                  <div className="text-xs text-pri-silver/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 relative">
        <div className="glow-divider mx-auto max-w-7xl" />
        <div className="max-w-7xl mx-auto px-4 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Kenapa <span className="text-pri-red">Academy</span>?
            </h2>
            <p className="text-pri-silver/60 max-w-xl mx-auto">
              Platform belajar yang dirancang khusus untuk mencetak talenta teknologi Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <Card key={i} className="glass-card-hover p-5 border-white/5">
                <CardContent className="p-0">
                  <div className="h-10 w-10 rounded-lg bg-pri-red/10 flex items-center justify-center mb-3">
                    <f.icon className="h-5 w-5 text-pri-red" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-pri-silver/60 leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED COURSES ===== */}
      <section className="py-20 relative">
        <div className="glow-divider mx-auto max-w-7xl" />
        <div className="max-w-7xl mx-auto px-4 pt-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Kursus <span className="text-pri-red">Unggulan</span>
              </h2>
              <p className="text-pri-silver/60 text-sm">
                Mulai perjalanan belajarmu dengan kursus pilihan
              </p>
            </div>
            <Link href="/academy/courses">
              <Button variant="ghost" className="text-pri-red hover:text-red-400 text-sm hidden sm:flex">
                Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <AcademyFeaturedCourses />
        </div>
      </section>

      {/* ===== LEARNING PATHS ===== */}
      <section className="py-20 relative">
        <div className="glow-divider mx-auto max-w-7xl" />
        <div className="max-w-7xl mx-auto px-4 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Pilih <span className="text-pri-red">Learning Path</span>-mu
            </h2>
            <p className="text-pri-silver/60 max-w-xl mx-auto">
              Ikuti jalur belajar terstruktur dari dasar hingga mahir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.title} className="glass-tech p-6 border-white/5 group">
                <CardContent className="p-0">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <path.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{path.title}</h3>
                  <p className="text-xs text-pri-silver/60 mb-3">{path.description}</p>
                  <p className="text-[10px] font-mono text-pri-red mb-3">{path.lessons} lessons</p>

                  <div className="space-y-1.5 mb-4">
                    {path.courses.map((course) => (
                      <div key={course} className="flex items-center gap-2 text-xs text-pri-silver/50">
                        <CheckCircle className="h-3 w-3 text-green-500/60" />
                        {course}
                      </div>
                    ))}
                  </div>

                  <Link href={`/academy/courses?path=${path.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button variant="outline" size="sm" className="w-full border-white/10 text-pri-silver hover:text-white group-hover:border-pri-red/30 transition-colors text-xs">
                      Mulai Path Ini <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 relative">
        <div className="glow-divider mx-auto max-w-7xl" />
        <div className="max-w-7xl mx-auto px-4 pt-16">
          <Card className="glass-card overflow-hidden border-2 border-white/5">
            <div className="bg-gradient-to-r from-pri-red/90 via-pri-red to-red-800 p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-60 h-60 rounded-full border-[12px] border-white" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-[12px] border-white" />
                <div className="absolute inset-0 grid-pattern opacity-[0.1]" />
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <Rocket className="h-12 w-12 text-white mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Siap Memulai Perjalanan Belajarmu?
                </h2>
                <p className="text-white/70 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
                  Bergabung dengan ribuan talenta teknologi Indonesia. 
                  GRATIS untuk seluruh anggota PRO RI di 38 provinsi.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/register">
                    <Button size="lg" className="bg-white text-pri-red hover:bg-white/90 px-8">
                      Daftar Anggota PRO RI
                    </Button>
                  </Link>
                  <Link href="/academy/login">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                      Sudah Punya Akun? Masuk
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

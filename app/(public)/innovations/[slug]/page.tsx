import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, MapPin, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicInnovation } from "@/features/public/data";

const categoryLabel: Record<string, string> = {
  robotics: "Robotika", ai: "AI", iot: "IoT", programming: "Programming", research: "Research",
};

export default async function InnovationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const innovation = await getPublicInnovation(slug);

  if (!innovation) notFound();

  const creator = (innovation as any).creator_id as { full_name: string } | null ?? null;
  const province = (innovation as any).province_id as { name: string } | null ?? null;

  return (
    <section className="pt-32 pb-16 circuit-pattern min-h-screen">
      <div className="container-wide px-4 max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/innovations"
          className="inline-flex items-center gap-1.5 text-sm text-pri-silver hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Inovasi
        </Link>

        {/* Hero Card */}
        <Card className="glass-card overflow-hidden border-2 border-white/10 mb-8">
          <div className="bg-gradient-to-r from-pri-red to-red-700 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 rounded-full border-8 border-white" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full border-8 border-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="default" className="bg-white/20 text-white border-white/20">
                  {categoryLabel[innovation.category] || innovation.category}
                </Badge>
                {innovation.status === "featured" && (
                  <Badge variant="success">Featured</Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {innovation.title}
              </h1>
              {innovation.year && (
                <p className="text-white/60 text-sm">{innovation.year}</p>
              )}
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            {/* Innovation Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {creator && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-5 w-5 text-pri-red shrink-0" />
                  <div>
                    <p className="text-pri-silver text-xs">Kreator</p>
                    <p className="text-white">{creator.full_name}</p>
                  </div>
                </div>
              )}
              {innovation.year && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-5 w-5 text-pri-red shrink-0" />
                  <div>
                    <p className="text-pri-silver text-xs">Tahun</p>
                    <p className="text-white">{innovation.year}</p>
                  </div>
                </div>
              )}
              {province && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-pri-red shrink-0" />
                  <div>
                    <p className="text-pri-silver text-xs">Provinsi</p>
                    <p className="text-white">{province.name}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Lightbulb className="h-5 w-5 text-pri-red shrink-0" />
                <div>
                  <p className="text-pri-silver text-xs">Kategori</p>
                  <p className="text-white">{categoryLabel[innovation.category] || innovation.category}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {innovation.description && (
              <div className="border-t border-white/10 pt-6">
                <h2 className="text-lg font-semibold text-white mb-4">Deskripsi</h2>
                <div className="text-sm text-pri-silver leading-relaxed whitespace-pre-wrap">
                  {innovation.description}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

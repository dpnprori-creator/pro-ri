import { Lightbulb, Sparkles } from "lucide-react";
import { getPublicInnovations } from "@/features/public/data";
import { PublicInnovationsClient } from "@/components/features/dashboard/public-innovations-client";

export default async function InnovationsPage() {
  const innovations = await getPublicInnovations(50);

  return (
    <section className="pt-32 pb-16 circuit-pattern relative overflow-hidden">
      <div className="hero-scan-line" />
      <div className="tech-particles">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="tech-particle"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: '100%',
              animationDelay: `${Math.random() * 18}s`,
              animationDuration: `${14 + Math.random() * 12}s`,
            }}
          />
        ))}
      </div>
      <div className="orbit-ring orbit-ring-2" style={{ top: '15%', right: '8%', width: '70px', height: '70px', opacity: 0.04 }} />
      <div className="container-wide px-4 relative z-10">
        <div className="text-center circuit-border rounded-xl p-8 mb-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-pri-red" />
            <span className="text-xs uppercase tracking-widest text-pri-silver font-medium">
              Karya & Inovasi
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Galeri <span className="text-gradient">Inovasi</span>
          </h1>
          <p className="text-lg text-pri-silver">
            Karya inovasi teknologi dari talenta Indonesia
          </p>
        </div>

        {innovations.length === 0 ? (
          <div className="text-center py-20">
            <Lightbulb className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
            <p className="text-pri-silver">Belum ada inovasi dipublikasikan</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <PublicInnovationsClient innovations={innovations as any[]} />
          </div>
        )}
      </div>
    </section>
  );
}

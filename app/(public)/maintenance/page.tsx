import { Wrench } from "lucide-react";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pri-carbon circuit-pattern overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
      <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
      <div className="tech-particles">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="tech-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: "100%",
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 12}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center max-w-md mx-auto px-4 relative z-10">
        <div className="h-20 w-20 rounded-2xl bg-pri-red/10 flex items-center justify-center mx-auto mb-6">
          <Wrench className="h-10 w-10 text-pri-red" />
        </div>

        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
          <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
            Maintenance Mode
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Sedang Dalam <span className="text-gradient">Perbaikan</span>
        </h1>

        <p className="text-pri-silver mb-8 leading-relaxed">
          Kami sedang melakukan pemeliharaan sistem untuk memberikan layanan terbaik.
          Silakan kembali lagi nanti.
        </p>

        <div className="glass rounded-xl p-4 border border-white/5 mb-8">
          <div className="flex items-center gap-2 text-sm text-pri-silver font-mono">
            <span className="text-pri-red">$</span>
            <span className="text-pri-silver/60">system_status</span>
            <span className="text-orange-400">maintenance</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-pri-silver font-mono mt-1">
            <span className="text-pri-red">$</span>
            <span className="text-pri-silver/60">estimated</span>
            <span className="text-white">soon</span>
          </div>
        </div>

        <Link
          href="/"
          className="text-sm text-pri-silver hover:text-pri-red transition-colors"
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

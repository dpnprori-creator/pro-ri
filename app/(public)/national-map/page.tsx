import { RealtimeDashboard } from "@/components/features/command-center/realtime-dashboard";
import { APP_NAME } from "@/lib/constants";

export default async function NationalMapPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 circuit-pattern overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-pri-red/5 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-pri-red/5 blur-3xl" />
        </div>
        {/* Floating particles */}
        <div className="tech-particles">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="tech-particle"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: '100%',
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>
        {/* Scan line */}
        <div className="hero-scan-line" />
        {/* Orbit rings */}
        <div className="orbit-ring" style={{ top: '15%', right: '5%', width: '120px', height: '120px', opacity: 0.06 }} />
        <div className="orbit-ring orbit-ring-2" style={{ bottom: '20%', left: '8%', width: '80px', height: '80px', opacity: 0.04 }} />

        <div className="container-wide px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <div className="relative">
                <span className="status-dot" />
              </div>
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Command Center Nasional
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Peta Nasional{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pri-red to-red-400">
                {APP_NAME}
              </span>
            </h1>
            <p className="text-pri-silver text-sm md:text-base max-w-2xl mx-auto">
              Visualisasi interaktif sebaran anggota, pertumbuhan, dan statistik
              nasional secara real-time. Klik provinsi untuk eksplorasi data
              hingga level desa/kelurahan.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="pb-16 px-4">
        <div className="container-wide">
          <RealtimeDashboard />
        </div>
      </section>
    </>
  );
}

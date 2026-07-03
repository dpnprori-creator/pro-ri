import Link from "next/link";
import { APP_NAME, NAV_PUBLIC } from "@/lib/constants";
import { Cpu, MapPin, Mail, Globe, ArrowUpRight } from "lucide-react";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-pri-carbon overflow-hidden">
      {/* Decorative tech elements */}
      <div className="absolute inset-0 circuit-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-pri-red/20 to-transparent" />
      <div className="absolute bottom-0 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-pri-red/10 to-transparent" />

      {/* Corner brackets */}
      <div className="corner-bracket corner-bracket-tl absolute" style={{ top: "20px", left: "20px" }} />
      <div className="corner-bracket corner-bracket-tr absolute" style={{ top: "20px", right: "20px" }} />
      <div className="corner-bracket corner-bracket-bl absolute" style={{ bottom: "20px", left: "20px" }} />
      <div className="corner-bracket corner-bracket-br absolute" style={{ bottom: "20px", right: "20px" }} />

      <div className="container-wide px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-9 w-9 rounded-lg bg-pri-red/10 flex items-center justify-center overflow-hidden">
                <div className="data-pulse-ring rounded-lg" style={{ width: "100%", height: "100%", inset: 0 }} />
                <span className="text-xs font-bold text-white relative z-10">PR</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-white">{APP_NAME}</span>
                <p className="text-[9px] text-pri-silver/40 font-mono uppercase tracking-widest">Gerakan Robotika Nasional</p>
              </div>
            </div>
            <p className="text-sm text-pri-silver/70 leading-relaxed max-w-xs">
              Pusat Robotika Rakyat Indonesia — gerakan robotika nasional untuk kedaulatan teknologi menuju Indonesia Emas 2045.
            </p>

            {/* Live status indicator */}
            <div className="flex items-center gap-2 mt-4 glass rounded-full px-3 py-1.5 w-fit border border-white/5">
              <span className="status-dot" />
              <span className="text-[10px] text-green-400/80 font-mono tracking-wider">SISTEM AKTIF</span>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-pri-red" />
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {NAV_PUBLIC.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-pri-silver/70 hover:text-pri-red transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-pri-red/0 group-hover:bg-pri-red transition-all" />
                    {item.label}
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-pri-red" />
              Informasi
            </h3>
            <ul className="space-y-2.5">
              {NAV_PUBLIC.slice(5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-pri-silver/70 hover:text-pri-red transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-pri-red/0 group-hover:bg-pri-red transition-all" />
                    {item.label}
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-pri-red" />
              Kontak
            </h3>
            <ul className="space-y-3 text-sm text-pri-silver/70">
              <li className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-md bg-pri-red/10 flex items-center justify-center">
                  <Mail className="h-3.5 w-3.5 text-pri-red" />
                </div>
                <span>dpn.prori@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-md bg-pri-red/10 flex items-center justify-center">
                  <Globe className="h-3.5 w-3.5 text-pri-red" />
                </div>
                <div>
                  <p>pro-ri.online</p>
                  <p className="text-xs text-pri-silver/40">academy.pro-ri.online</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-md bg-pri-red/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-pri-red" />
                </div>
                <span className="text-xs leading-relaxed">
                  DPN PRO RI — Jl. Sultan Agung No.9, Guntur, Setiabudi, Jakarta Selatan 12980
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-pri-silver/40 font-mono">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-pri-silver/30 font-mono">v1.0.0</span>
            <span className="text-pri-silver/20">|</span>
            <span className="text-[10px] text-pri-silver/30 font-mono flex items-center gap-1">
              <Cpu className="h-2.5 w-2.5" />
              BUILD WITH PURPOSE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

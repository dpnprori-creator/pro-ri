import Link from "next/link";
import { GraduationCap, Mail, Globe, ArrowUpRight } from "lucide-react";

export function AcademyFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-pri-carbon to-[#0a0c14] overflow-hidden mt-auto">
      <div className="absolute inset-0 circuit-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-pri-red/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pri-red to-red-700 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-white">PRO RI <span className="text-pri-red">Academy</span></span>
                <p className="text-[8px] text-pri-silver/40 font-mono uppercase tracking-widest">Learning Ecosystem</p>
              </div>
            </div>
            <p className="text-sm text-pri-silver/60 leading-relaxed max-w-xs">
              Platform pengembangan talenta teknologi Indonesia. Belajar, berlatih, berkarya, dan raih sertifikasi.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-px w-4 bg-pri-red" />
              Academy
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Semua Kursus", href: "/academy/courses" },
                { label: "Learning Path", href: "/academy/courses?view=path" },
                { label: "Sertifikat Saya", href: "/membership/certificates" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-pri-silver/60 hover:text-pri-red transition-colors flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-pri-red/0 group-hover:bg-pri-red transition-all" />
                    {item.label}
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organisasi */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-px w-4 bg-pri-red" />
              PRO RI
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Website Utama", href: "/" },
                { label: "Tentang Kami", href: "/about" },
                { label: "Program Unggulan", href: "/programs" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-pri-silver/60 hover:text-pri-red transition-colors flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-pri-red/0 group-hover:bg-pri-red transition-all" />
                    {item.label}
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-px w-4 bg-pri-red" />
              Kontak
            </h3>
            <ul className="space-y-3 text-sm text-pri-silver/60">
              <li className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-pri-red" />
                <span>dpn.prori@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="h-3.5 w-3.5 text-pri-red" />
                <div>
                  <p>pro-ri.online</p>
                  <p className="text-xs text-pri-silver/30">academy.pro-ri.online</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-pri-silver/30 font-mono">
            &copy; {currentYear} PRO RI Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-pri-silver/20 font-mono">v1.0.0</span>
            <span className="text-pri-silver/20">|</span>
            <span className="text-[10px] text-pri-silver/20 font-mono">BUILD WITH PURPOSE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

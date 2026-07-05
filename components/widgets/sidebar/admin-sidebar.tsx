"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Lightbulb,
  Award,
  Newspaper,
  Activity,
  Images,
  MessageSquare,
  Settings,
  Shield,
  UserCheck,
  LogOut,
  Video,
  BookOpen,
} from "lucide-react";
import { getPendingVerificationCount } from "@/features/events/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { APP_NAME_SHORT } from "@/lib/constants";
import { logout, getCurrentUserRole } from "@/features/auth/actions";

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Programs", href: "/admin/programs", icon: BookOpen },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Inovasi", href: "/admin/innovations", icon: Lightbulb },
  { label: "Sertifikat", href: "/admin/certificates", icon: Award },
  { label: "Verifikasi", href: "/admin/verification", icon: UserCheck },
  { label: "Berita", href: "/admin/news", icon: Newspaper },
  { label: "Monitoring", href: "/admin/monitoring", icon: Activity },
  { label: "Content Editor", href: "/admin/content-editor", icon: Newspaper },
  { label: "Hero Gallery", href: "/admin/gallery", icon: Images },
  { label: "Galeri Kegiatan", href: "/admin/gallery-kegiatan", icon: Images },
  { label: "Video Galeri", href: "/admin/videos", icon: Video },
  { label: "Verifikasi Anggota", href: "/admin/member-verification", icon: UserCheck },
  { label: "Pesan Kontak", href: "/admin/messages", icon: MessageSquare },
];

const superAdminNavItems = [
  { label: "Super Admin", href: "/admin/super-admin", icon: Shield },
  { label: "Manage Admins", href: "/admin/admins", icon: Shield },
  { label: "Activity Logs", href: "/admin/activity", icon: Activity },
  { label: "Role Mgmt", href: "/admin/roles", icon: UserCheck },
  { label: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [pendingCounts, setPendingCounts] = useState({ verifikasi: 0, verifikasiAnggota: 0 });

  useEffect(() => {
    getCurrentUserRole().then(({ role }) => {
      setIsSuperAdmin(role === "super_admin");
    }).catch((err) => {
      console.error("Failed to check role:", err);
    });
  }, [pathname]);

  // Fetch pending verification counts
  useEffect(() => {
    getPendingVerificationCount().then(setPendingCounts).catch(() => {});
  }, []);

  return (
    <aside className="flex flex-col w-64 border-r border-white/10 bg-pri-carbon glass h-screen overflow-hidden">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
        <div className="h-10 w-10 flex items-center justify-center">
          <Image
            src="/images/logo-putih.jpeg"
            alt={APP_NAME_SHORT}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <span className="text-sm font-semibold text-white">{APP_NAME_SHORT}</span>
          <p className="text-[8px] text-pri-silver/50 font-mono uppercase tracking-wider leading-none">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto min-h-0">
        {/* Admin Nav Items */}
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          const isVerifikasi = item.href === "/admin/verification";
          const isVerifikasiAnggota = item.href === "/admin/member-verification";
          const count = isVerifikasi ? pendingCounts.verifikasi : isVerifikasiAnggota ? pendingCounts.verifikasiAnggota : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-pri-red/10 text-pri-red border border-pri-red/20"
                  : "text-pri-silver hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {count > 0 && (
                <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-pri-red/20 text-pri-red font-medium">
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        {/* Super Admin Separator & Nav Items (only for super_admin) */}
        {isSuperAdmin && (
          <>
            <div className="pt-2 pb-1">
              <div className="flex items-center gap-2 px-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] uppercase tracking-wider text-purple-400/60 font-medium">
                  Super Admin
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </div>

            {superAdminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                    isActive
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      : "text-pri-silver hover:text-purple-400 hover:bg-purple-500/5"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full justify-start text-pri-silver hover:text-white">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Member Dashboard
          </Button>
        </Link>
        <form action={logout}>
          <Button type="submit" variant="ghost" className="w-full justify-start text-pri-silver hover:text-red-400">
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </form>
      </div>
    </aside>
  );
}

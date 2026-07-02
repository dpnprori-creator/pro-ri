"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Map,
  Users,
  Calendar,
  Lightbulb,
  GraduationCap,
  BookOpen,
  Award,
  User,
  Shield,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { APP_NAME_SHORT } from "@/lib/constants";
import { logout, getCurrentUserRole } from "@/features/auth/actions";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kartu Anggota", href: "/my-member-card", icon: CreditCard },
  { label: "Programs", href: "/dashboard/programs", icon: BookOpen },
  { label: "Peta Nasional", href: "/dashboard/national-map", icon: Map },
  { label: "Direktori", href: "/members", icon: Users },
  { label: "Events", href: "/dashboard/events", icon: Calendar },
  { label: "Inovasi", href: "/dashboard/innovations", icon: Lightbulb },
  { label: "Akademi", href: "/academy", icon: GraduationCap },
  { label: "Sertifikat", href: "/membership/certificates", icon: Award },
  { label: "Profil", href: "/profile", icon: User },
];

interface DashboardSidebarProps {
  onClose?: () => void;
}

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getCurrentUserRole().then(({ role }) => {
      setIsAdmin(role === "admin" || role === "super_admin");
    }).catch((err) => {
      console.error("Failed to check role:", err);
    });
  }, [pathname]);

  return (
    <aside className="flex flex-col w-64 border-r border-white/10 bg-pri-carbon glass h-screen overflow-hidden">
      {/* Logo */}
      <div className="flex items-center justify-between gap-2 px-6 h-16 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 flex items-center justify-center">
            <Image
              src="/images/logo-putih.jpeg"
              alt={APP_NAME_SHORT}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-sm font-semibold text-white">{APP_NAME_SHORT}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-pri-silver hover:text-white transition-colors"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto min-h-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-pri-red/10 text-pri-red border border-pri-red/20"
                  : "text-pri-silver hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {/* Admin Panel link for admin/super_admin users */}
        {isAdmin && (
          <>
            <div className="pt-2 pb-1">
              <div className="h-px bg-white/10" />
            </div>
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-pri-silver hover:text-purple-400 hover:bg-purple-500/5"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
            </Link>
          </>
        )}
      </nav>

      {/* Theme Toggle & Logout */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <ThemeToggle variant="full" className="w-full justify-start" />
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-pri-silver hover:text-red-400"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </form>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X, LogIn, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUserRole, logout } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Beranda", href: "/academy" },
  { label: "Kursus", href: "/academy/courses" },
  { label: "Dashboard", href: "/academy/dashboard" },
  { label: "Learning Path", href: "/academy/courses?view=path" },
];

export function AcademyNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSession(true);
        const { data: member } = await supabase
          .from("members")
          .select("full_name")
          .eq("auth_id", user.id)
          .single();
        setUserName(member?.full_name || user.email?.split("@")[0] || "");
      } else {
        setSession(false);
      }
    };
    check();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-pri-carbon via-[#0f1120] to-pri-carbon border-b border-white/10">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/academy" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-pri-red to-red-700 flex items-center justify-center shadow-lg shadow-pri-red/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-white tracking-wide group-hover:text-pri-red transition-colors">
                PRO RI <span className="text-pri-red">Academy</span>
              </span>
              <p className="text-[8px] text-pri-silver/50 font-mono uppercase tracking-widest leading-none mt-0.5">
                Learning Ecosystem
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/academy" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-all duration-200",
                    isActive
                      ? "text-pri-red bg-pri-red/5"
                      : "text-pri-silver hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {session === null ? (
              <div className="h-8 w-20 bg-white/5 rounded animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                >
                  <div className="h-6 w-6 rounded-full bg-pri-red/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-pri-red">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-pri-silver hidden sm:block max-w-[100px] truncate">
                    {userName}
                  </span>
                  <ChevronDown className="h-3 w-3 text-pri-silver/50" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-pri-dark shadow-xl z-50 py-1">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-xs text-pri-silver hover:text-white hover:bg-white/5"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard PRO RI
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-xs text-pri-silver hover:text-white hover:bg-white/5"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profil Saya
                      </Link>
                      <hr className="border-white/10 my-1" />
                      <form action={logout}>
                        <button
                          type="submit"
                          className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 flex items-center gap-2"
                        >
                          <LogOut className="h-3 w-3" /> Keluar
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/academy/login">
                <Button size="sm" className="bg-pri-red hover:bg-red-700 text-white text-xs h-8">
                  <LogIn className="h-3.5 w-3.5 mr-1" /> Masuk
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-pri-silver hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10">
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2.5 text-sm text-pri-silver hover:text-white rounded-md hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-white/10 my-2" />
              {!session && (
                <Link
                  href="/academy/login"
                  className="px-3 py-2.5 text-sm bg-pri-red text-white rounded-md text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Masuk
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

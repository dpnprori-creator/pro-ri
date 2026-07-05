"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_PUBLIC, APP_NAME_SHORT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-pri-carbon/95 border-b border-white/10">
        <div className="container-wide flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 flex items-center justify-center">
              <div className="data-pulse-ring rounded-full" />
              <Image
                src="/images/logo-putih.jpeg"
                alt={APP_NAME_SHORT}
                width={44}
                height={44}
                className="rounded-full object-cover relative z-10"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-white tracking-wide group-hover:text-pri-red transition-colors">
                {APP_NAME_SHORT}
              </span>
              <p className="text-[8px] text-pri-silver/60 font-mono uppercase tracking-wider leading-none mt-0.5">
                Digital Command Center
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_PUBLIC.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-pri-silver hover:text-white transition-colors rounded-md hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-pri-silver hover:text-white">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-pri-red hover:bg-red-700 text-white">
                Daftar
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-pri-silver hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-pri-carbon/95 border-b border-white/10 transition-all duration-300 overflow-hidden",
          mobileOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="flex flex-col p-4 gap-1">
          {NAV_PUBLIC.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2.5 text-sm text-pri-silver hover:text-white transition-colors rounded-md hover:bg-white/5"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <hr className="border-white/10 my-2" />
          <Link href="/login" className="px-3 py-2.5 text-sm text-pri-silver hover:text-white">
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-3 py-2.5 text-sm bg-pri-red text-white rounded-md text-center mt-1"
            onClick={() => setMobileOpen(false)}
          >
            Daftar
          </Link>
        </nav>
      </div>
    </header>
  );
}

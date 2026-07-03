"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HeroGalleryItem } from "@/features/public/gallery-data";

interface HeroGalleryProps {
  items: HeroGalleryItem[];
}

export function HeroGallery({ items }: HeroGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, isPaused, items.length]);

  if (items.length === 0) return null;

  const item = items[current];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pri-carbon"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 100% Opaque Background — Solid dark with subtle texture */}
      <div className="absolute inset-0 bg-pri-carbon z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-[0.04]" />
        <div className="absolute inset-0 circuit-pattern opacity-[0.06]" />
        
        {/* Background image — very subtle */}
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          className="object-cover opacity-[0.06]"
          priority
        />

        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-pri-carbon/40 via-transparent to-pri-carbon/60" />
      </div>

      {/* Decorative Elements — all positioned in background layer (z-1) */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {/* Hexagons — shifted to edges/corners to avoid overlapping content */}
        <div className="hero-hexagon" style={{ top: "8%", left: "3%", opacity: 0.5 }} />
        <div className="hero-hexagon" style={{ top: "50%", right: "2%", opacity: 0.3 }} />
        <div className="hero-hexagon" style={{ bottom: "10%", left: "5%", width: "40px", height: "70px", opacity: 0.25 }} />

        {/* Circuit Lines — placed in corners/edges only */}
        <div className="hero-circuit-line" style={{ top: "12%", left: "2%", width: "120px", opacity: 0.4 }} />
        <div className="hero-circuit-line" style={{ top: "45%", right: "1%", width: "100px", opacity: 0.3 }} />
        <div className="hero-circuit-line" style={{ bottom: "20%", left: "8%", width: "100px", opacity: 0.25 }} />

        {/* Rotating Gears — pushed to edges */}
        <div className="hero-gear hero-gear-1" style={{ top: "5%", right: "2%", opacity: 0.35 }} />
        <div className="hero-gear hero-gear-2" style={{ bottom: "8%", left: "3%", opacity: 0.25 }} />

        {/* Corner Accents */}
        <div className="hero-corner-tl" />
        <div className="hero-corner-tr" />
        <div className="hero-corner-bl" />
        <div className="hero-corner-br" />

        {/* Scanning Line — very subtle */}
        <div className="hero-scan-line" style={{ opacity: 0.3 }} />
      </div>

      {/* Content — high z-index above all decorations */}
      <div className="relative z-20 container-wide px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-20 text-center flex flex-col items-center justify-center min-h-screen">
        {/* Square Logo — Large */}
        <div className="flex justify-center mb-4 sm:mb-5 md:mb-8">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-xl overflow-hidden ring-2 ring-pri-red/20 shadow-lg shadow-pri-red/10">
            <Image
              src="/images/logo-putih.jpeg"
              alt="PRO RI"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 md:mb-6 border border-pri-red/10">
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-pri-red animate-pulse" />
          <span className="text-[10px] sm:text-xs text-pri-silver tracking-wider uppercase font-mono">
            Pusat Robotika Rakyat Indonesia
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-snug md:leading-tight mb-4 md:mb-6 max-w-6xl mx-auto px-2 transition-all duration-500">
          {item.title}
        </h1>

        {item.description && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-pri-silver max-w-4xl mx-auto mb-6 md:mb-10 leading-relaxed px-4 transition-all duration-500">
            {item.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          {item.link_url ? (
            <Link href={item.link_url}>
              <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-8 text-base glow-red w-full sm:w-auto">
                {item.link_label || "Pelajari Selengkapnya"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-8 text-base glow-red w-full sm:w-auto">
                Daftar Anggota Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link href="/programs" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="px-8 text-base border-white/10 w-full sm:w-auto">
              Pelajari Program Kami
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows — hidden on mobile, visible md+ */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full glass items-center justify-center text-pri-silver hover:text-white hover:bg-white/10 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full glass items-center justify-center text-pri-silver hover:text-white hover:bg-white/10 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "w-8 h-2.5 bg-pri-red shadow-lg shadow-pri-red/30"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-30">
        <div className="h-8 w-5 rounded-full border border-white/10 flex items-start justify-center pt-2">
          <div className="h-2 w-1 rounded-full bg-pri-red/60" />
        </div>
      </div>
    </section>
  );
}

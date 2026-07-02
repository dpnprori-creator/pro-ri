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
      <div className="absolute inset-0 bg-pri-carbon">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-[0.04]" />
        <div className="absolute inset-0 circuit-pattern opacity-[0.06]" />
        
        {/* Background image with very subtle presence */}
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          className="object-cover opacity-[0.06]"
          priority
        />
      </div>

      {/* Decorative Robot-themed Elements */}
      {/* Hexagons */}
      <div className="hero-hexagon" style={{ top: "15%", left: "8%" }} />
      <div className="hero-hexagon" style={{ top: "60%", right: "12%" }} />
      <div className="hero-hexagon" style={{ top: "75%", left: "50%", width: "50px", height: "87px" }} />

      {/* Circuit Lines */}
      <div className="hero-circuit-line" style={{ top: "25%", left: "5%", width: "200px" }} />
      <div className="hero-circuit-line" style={{ top: "35%", right: "10%", width: "150px", transform: "rotate(45deg)" }} />
      <div className="hero-circuit-line" style={{ bottom: "30%", left: "15%", width: "180px", transform: "rotate(-30deg)" }} />

      {/* Rotating Gears */}
      <div className="hero-gear hero-gear-1" style={{ top: "10%", right: "8%" }} />
      <div className="hero-gear hero-gear-2" style={{ bottom: "15%", left: "10%" }} />

      {/* Corner Accents */}
      <div className="hero-corner-tl" />
      <div className="hero-corner-tr" />
      <div className="hero-corner-bl" />
      <div className="hero-corner-br" />

      {/* Scanning Line */}
      <div className="hero-scan-line" />

      {/* Content */}
      <div className="relative z-20 container-wide px-4 pt-16 sm:pt-20 md:pt-24 text-center flex flex-col items-center justify-center">
        {/* Square Logo — Large */}
        <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
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
        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 sm:px-4 sm:py-1.5 mb-3 md:mb-5 transition-all duration-500 border border-pri-red/10">
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-pri-red animate-pulse" />
          <span className="text-[10px] sm:text-xs text-pri-silver tracking-wider uppercase font-mono">
            Pusat Robotika Rakyat Indonesia
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-white leading-snug md:leading-tight mb-3 md:mb-5 transition-all duration-500 max-w-5xl mx-auto px-2">
          {item.title}
        </h1>

        {item.description && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-pri-silver max-w-3xl mx-auto mb-5 md:mb-8 leading-relaxed transition-all duration-500 px-4">
            {item.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {item.link_url ? (
            <Link href={item.link_url}>
              <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-6 sm:px-8 text-sm sm:text-base glow-red w-full sm:w-auto">
                {item.link_label || "Pelajari Selengkapnya"} <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-6 sm:px-8 text-sm sm:text-base glow-red w-full sm:w-auto">
                Daftar Anggota Sekarang <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          )}
          <Link href="/programs" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="px-6 sm:px-8 text-sm sm:text-base border-white/10 w-full sm:w-auto">
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
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full glass items-center justify-center text-pri-silver hover:text-white hover:bg-white/10 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full glass items-center justify-center text-pri-silver hover:text-white hover:bg-white/10 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator — positioned below buttons, above scroll indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-28 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-pri-red shadow-lg shadow-pri-red/30"
                  : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator — small, positioned at very bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-30">
        <div className="h-6 w-4 md:h-8 md:w-5 rounded-full border border-white/10 flex items-start justify-center pt-1.5 md:pt-2">
          <div className="h-1.5 w-0.5 md:h-2 md:w-1 rounded-full bg-pri-red/60" />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useRef } from "react";
import { Film, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoWithFallbackProps {
  src: string;
  poster?: string;
  title: string;
  description?: string;
  className?: string;
}

export function VideoWithFallback({
  src,
  poster,
  title,
  description,
  className,
}: VideoWithFallbackProps) {
  const [status, setStatus] = useState<"loading" | "playing" | "error">(
    "loading"
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCanPlay = () => {
    setStatus("playing");
  };

  const handleError = () => {
    setStatus("error");
  };

  const retry = () => {
    setStatus("loading");
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div
      className={cn(
        "relative aspect-video rounded-xl overflow-hidden glass-card-hover group bg-pri-dark",
        className
      )}
    >
      {/* Video element (always mounted for SEO/preload) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={poster || undefined}
        onCanPlay={handleCanPlay}
        onError={handleError}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={src} type='video/mp4; codecs="hvc1"' />
        <source src={src} type="video/mp4" />
      </video>

      {/* Loading overlay */}
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-pri-dark/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-pri-red/30 border-t-pri-red animate-spin" />
            <span className="text-[10px] text-pri-silver/50 font-mono">
              Memuat video...
            </span>
          </div>
        </div>
      )}

      {/* Error fallback */}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-pri-dark z-10">
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <AlertCircle className="h-8 w-8 text-pri-red/60" />
            <div>
              <p className="text-sm text-pri-silver font-medium">{title}</p>
              {description && (
                <p className="text-xs text-pri-silver/50 mt-0.5">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono bg-white/10 text-pri-silver hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Muat Ulang
            </button>
          </div>
        </div>
      )}

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon/80 via-transparent to-transparent pointer-events-none" />

      {/* Title bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
        <p className="text-sm text-white font-semibold flex items-center gap-2">
          <Film className="h-4 w-4 text-pri-red" />
          {title}
        </p>
        {description && (
          <p className="text-xs text-white/60 mt-0.5">{description}</p>
        )}
      </div>

      {/* LIVE badge */}
      <div className="absolute top-3 right-3 pointer-events-none z-20">
        <span className="text-[10px] font-mono bg-pri-red/80 text-white px-2 py-0.5 rounded-full">
          {status === "error" ? "OFFLINE" : "LIVE"}
        </span>
      </div>
    </div>
  );
}

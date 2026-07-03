"use client";

import { useState, useRef } from "react";
import { Film, AlertCircle } from "lucide-react";
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
  const [status, setStatus] = useState<"loading" | "playing" | "static" | "error">(
    src ? "loading" : "static"
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCanPlay = () => {
    setStatus("playing");
  };

  const handleError = () => {
    setStatus("error");
  };

  const hasVideo = src && src.length > 0;

  return (
    <div
      className={cn(
        "relative aspect-video rounded-xl overflow-hidden glass-card-hover group bg-pri-dark",
        className
      )}
    >
      {/* Poster/Static background — always shown */}
      {poster && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      {/* Video element — only if src is provided */}
      {hasVideo && (
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
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon/90 via-pri-carbon/30 to-transparent" />

      {/* Loading overlay — only when video is loading */}
      {status === "loading" && hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-pri-dark/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-pri-red/30 border-t-pri-red animate-spin" />
            <span className="text-[10px] text-pri-silver/50 font-mono">
              Memuat video...
            </span>
          </div>
        </div>
      )}

      {/* Static mode badge — when no video source */}
      {!hasVideo && (
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <span className="text-[10px] font-mono bg-white/10 text-pri-silver/60 px-2 py-0.5 rounded-full border border-white/10">
            GALERI
          </span>
        </div>
      )}

      {/* Error fallback */}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-pri-dark/70 z-10">
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
          </div>
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
        {/* Title bar */}
        <div className="pointer-events-none">
          <p className="text-sm text-white font-semibold flex items-center gap-2">
            <Film className="h-4 w-4 text-pri-red" />
            {title}
          </p>
          {description && (
            <p className="text-xs text-white/60 mt-0.5">{description}</p>
          )}
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Play, CheckCircle } from "lucide-react";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface VideoTrackerProps {
  videoUrl: string;
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export function VideoTracker({
  videoUrl,
  lessonId,
  courseId,
  isCompleted,
  onComplete,
}: VideoTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const watchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);
  const [thresholdReached, setThresholdReached] = useState(isCompleted);
  const [playerState, setPlayerState] = useState<number>(-1);

  const isYouTube =
    videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

  const getYouTubeId = useCallback((url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }, []);

  const videoId = isYouTube ? getYouTubeId(videoUrl) : null;

  // Load YouTube IFrame API
  useEffect(() => {
    if (!isYouTube || !videoId) return;

    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(tag, firstScript);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    function initPlayer() {
      if (!containerRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId!,
        playerVars: {
          autoplay: 0,
          rel: 0,
          modestbranding: 1,
          controls: 1,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
          },
          onStateChange: (event: { data: number }) => {
            setPlayerState(event.data);
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTracking();
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              stopTracking();
            }
          },
        },
      });
    }

    return () => {
      stopTracking();
      playerRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYouTube, videoId]);

  const startTracking = useCallback(() => {
    stopTracking();
    watchIntervalRef.current = setInterval(() => {
      try {
        const player = playerRef.current;
        if (!player || !player.getCurrentTime || !player.getDuration) return;

        const current = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration <= 0) return;

        const pct = Math.min(100, Math.round((current / duration) * 100));
        setWatchProgress(pct);

        if (pct >= 90 && !thresholdReached) {
          setThresholdReached(true);
          onComplete();
        }
      } catch {
        // Player not ready yet
      }
    }, 2000);
  }, [thresholdReached, onComplete]);

  const stopTracking = useCallback(() => {
    if (watchIntervalRef.current) {
      clearInterval(watchIntervalRef.current);
      watchIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTracking();
  }, [stopTracking]);

  // Non-YouTube video: show simple embed with manual completion
  if (!isYouTube || !videoId) {
    return (
      <div className="space-y-3">
        <div className="aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
          <video
            controls
            className="w-full h-full"
            onEnded={() => {
              if (!thresholdReached) {
                setThresholdReached(true);
                setWatchProgress(100);
                onComplete();
              }
            }}
            onTimeUpdate={(e) => {
              const vid = e.currentTarget;
              if (vid.duration > 0) {
                const pct = Math.round((vid.currentTime / vid.duration) * 100);
                setWatchProgress(pct);
                if (pct >= 90 && !thresholdReached) {
                  setThresholdReached(true);
                  onComplete();
                }
              }
            }}
          >
            <source src={videoUrl} />
          </video>
        </div>
        {watchProgress > 0 && !isCompleted && (
          <div className="flex items-center gap-2 text-xs text-pri-silver/50">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-pri-red rounded-full transition-all"
                style={{ width: `${watchProgress}%` }}
              />
            </div>
            <span className="font-mono">{watchProgress}%</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Video container */}
      <div className="aspect-video rounded-xl overflow-hidden bg-black border border-white/10 relative">
        {!playerReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-pri-carbon/80">
            <Loader2 className="h-8 w-8 text-pri-silver animate-spin" />
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Progress bar + status */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${thresholdReached ? 100 : watchProgress}%`,
              background: thresholdReached
                ? "linear-gradient(90deg, #22c55e, #4ade80)"
                : "linear-gradient(90deg, #dc2626, #f87171)",
            }}
          />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {thresholdReached ? (
            <>
              <CheckCircle className="h-3.5 w-3.5 text-green-400" />
              <span className="text-[10px] font-medium text-green-400 font-mono">
                Tersimak
              </span>
            </>
          ) : playerState === 1 ? (
            <>
              <Play className="h-3 w-3 text-pri-red animate-pulse" />
              <span className="text-[10px] text-pri-silver/50 font-mono">
                {watchProgress}%
              </span>
            </>
          ) : (
            <span className="text-[10px] text-pri-silver/30 font-mono">
              Putar video untuk mulai
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

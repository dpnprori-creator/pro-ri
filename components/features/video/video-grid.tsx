"use client";

import { VideoWithFallback } from "./video-with-fallback";
import { AnimatedCard } from "@/components/features/home/animated-stats";
import { robotVideos } from "./robot-videos";

export function RobotVideoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
      {robotVideos.map((video, i) => (
        <AnimatedCard key={video.id} delay={i * 0.08}>
          <VideoWithFallback
            src={video.videoUrl}
            poster={video.posterUrl}
            title={video.title}
            description={video.description}
          />
        </AnimatedCard>
      ))}
    </div>
  );
}

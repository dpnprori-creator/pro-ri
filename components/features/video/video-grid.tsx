"use client";

import { VideoWithFallback } from "./video-with-fallback";
import { AnimatedCard } from "@/components/features/home/animated-stats";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  poster_url: string | null;
}

interface RobotVideoGridProps {
  videos?: VideoItem[];
}

export function RobotVideoGrid({ videos }: RobotVideoGridProps) {
  // If no videos from database, use fallback static data
  if (!videos || videos.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {staticFallbackVideos.map((video, i) => (
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
      {videos.slice(0, 4).map((video, i) => (
        <AnimatedCard key={video.id} delay={i * 0.08}>
          <VideoWithFallback
            src={video.video_url}
            poster={video.poster_url || undefined}
            title={video.title}
            description={video.description || undefined}
          />
        </AnimatedCard>
      ))}
    </div>
  );
}

const staticFallbackVideos = [
  {
    id: "robot-rover",
    title: "Robot Rover",
    description: "Robot penjelajah otonom bergerak di lingkungan nyata",
    videoUrl: "",
    posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=480&q=60",
  },
  {
    id: "robotic-arm-human",
    title: "Kolaborasi Robot & Manusia",
    description: "Lengan robotik dan tangan manusia hampir bersentuhan",
    videoUrl: "",
    posterUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=480&q=60",
  },
  {
    id: "humanoid-robot",
    title: "Humanoid Robot",
    description: "Robot humanoid futuristik di laboratorium teknologi",
    videoUrl: "",
    posterUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=480&q=60",
  },
  {
    id: "drone-tech",
    title: "Teknologi Drone",
    description: "Drone terbang dengan presisi untuk berbagai aplikasi",
    videoUrl: "",
    posterUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=480&q=60",
  },
];

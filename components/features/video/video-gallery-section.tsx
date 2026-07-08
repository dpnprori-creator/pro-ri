"use client";

import { useState, useRef } from "react";
import { Film, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  poster_url: string | null;
  sort_order: number;
}

interface VideoGallerySectionProps {
  videos: VideoItem[];
}

export function VideoGallerySection({ videos }: VideoGallerySectionProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (videos.length === 0) return null;

  const openVideo = (video: VideoItem, index: number) => {
    setActiveVideo(video);
    setCurrentIndex(index);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  const navigateVideo = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + videos.length) % videos.length
        : (currentIndex + 1) % videos.length;
    setActiveVideo(videos[newIndex]);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded-lg bg-pri-red/20 flex items-center justify-center">
          <Film className="h-4 w-4 text-pri-red" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Galeri Video</h2>
          <p className="text-xs text-pri-silver/60">{videos.length} video</p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video, i) => (
          <button
            key={video.id}
            onClick={() => openVideo(video, i)}
            className="group relative aspect-video rounded-xl overflow-hidden glass-card-hover bg-pri-dark border border-white/10 hover:border-pri-red/30 transition-all duration-300"
          >
            {/* Poster */}
            {video.poster_url ? (
              <img
                src={video.poster_url}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-pri-red/10 to-pri-dark flex items-center justify-center">
                <Film className="h-12 w-12 text-white/20" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon/90 via-pri-carbon/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-pri-red/80 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-pri-red/30">
                <Play className="h-5 w-5 text-white ml-0.5" />
              </div>
            </div>

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-sm text-white font-medium line-clamp-1 text-left">
                {video.title}
              </p>
              {video.description && (
                <p className="text-[10px] text-white/60 line-clamp-1 text-left mt-0.5">
                  {video.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeVideo}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            {/* Navigation */}
            {videos.length > 1 && (
              <>
                <button
                  onClick={() => navigateVideo("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 flex items-center justify-center hover:bg-pri-red/80 transition-colors z-10"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={() => navigateVideo("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 flex items-center justify-center hover:bg-pri-red/80 transition-colors z-10"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            )}

            {/* Video Player */}
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <video
                controls
                autoPlay
                className="w-full h-full"
                poster={activeVideo.poster_url || undefined}
              >
                <source src={activeVideo.video_url} type='video/mp4; codecs="hvc1"' />
                <source src={activeVideo.video_url} type="video/mp4" />
              </video>
            </div>

            {/* Info */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white">
                {activeVideo.title}
              </h3>
              {activeVideo.description && (
                <p className="text-sm text-pri-silver mt-1">
                  {activeVideo.description}
                </p>
              )}
              <p className="text-xs text-pri-silver/40 mt-2 font-mono">
                {currentIndex + 1} / {videos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

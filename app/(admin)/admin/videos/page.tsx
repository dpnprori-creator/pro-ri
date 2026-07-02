import { createClient } from "@/lib/supabase/server";
import { VideosManager } from "./videos-manager";

async function getVideos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("videos")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export default async function AdminVideosPage() {
  const videos = await getVideos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Video</h1>
        <p className="text-pri-silver mt-1">Total {videos.length} video</p>
      </div>

      <VideosManager videos={videos} />
    </div>
  );
}

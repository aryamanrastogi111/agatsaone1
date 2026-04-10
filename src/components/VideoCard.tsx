import { useState } from "react";
import { Play } from "lucide-react";

export interface VideoItem {
  id: string;
  title: string;
}

interface VideoCardProps {
  video: VideoItem;
  hero?: boolean;
}

export function VideoCard({ video, hero = false }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="w-full h-full group cursor-pointer"
            aria-label={`Play ${video.title}`}
          >
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`rounded-full bg-[#7C4DFF]/80 flex items-center justify-center group-hover:bg-[#7C4DFF] transition-colors ${
                  hero ? "w-20 h-20 p-6" : "w-14 h-14 p-4"
                }`}
              >
                <Play className="w-full h-full text-white fill-white ml-0.5" />
              </div>
            </div>
          </button>
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-white">{video.title}</p>
    </div>
  );
}

const YOUTUBE_CHANNEL = "https://www.youtube.com/channel/UC_DEStSXEIIRQCFfj2ObS1g";

export function YouTubeChannelLink() {
  return (
    <div className="text-right mt-8">
      <a
        href={YOUTUBE_CHANNEL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[#7C4DFF] hover:text-[#7C4DFF]/80 font-medium transition-colors text-sm"
      >
        See all videos on YouTube →
      </a>
    </div>
  );
}

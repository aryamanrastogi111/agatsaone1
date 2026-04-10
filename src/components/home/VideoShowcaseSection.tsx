import { VideoCard, YouTubeChannelLink } from "@/components/VideoCard";
import type { VideoItem } from "@/components/VideoCard";

const VIDEOS: VideoItem[] = [
  { id: "Lehu-0DV-74", title: "SanketLife ECG — Product Demo" },
  { id: "j8QwXnQwozg", title: "How to Set Up EasyTouch Rhythm" },
  { id: "Ck8syb2uQdo", title: "Why Watch ECGs Aren't Enough" },
  { id: "m57UYezHL0U", title: "Why Rhythm, Not Just Numbers" },
  { id: "TsFiHSnWAnI", title: "From Idea to Approval: MedTech in India" },
  { id: "e9f0DR890zM", title: "India: The Diabetes Capital" },
];

export function VideoShowcaseSection() {
  return (
    <section className="py-20 md:py-28 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            See It In Action
          </h2>
          <p className="mt-3 text-lg text-white/60">
            Real people, real results
          </p>
        </div>

        {/* Horizontal scroll mobile, 3-col grid desktop */}
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {VIDEOS.map((v) => (
            <div key={v.id} className="min-w-[280px] sm:min-w-0 snap-start">
              <VideoCard video={v} />
            </div>
          ))}
        </div>

        <YouTubeChannelLink />
      </div>
    </section>
  );
}

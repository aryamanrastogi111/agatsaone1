import { VideoCard, YouTubeChannelLink } from "@/components/VideoCard";
import type { VideoItem } from "@/components/VideoCard";

const TRUST_VIDEOS: VideoItem[] = [
  { id: "u26lsahqY8k", title: "Dr. Sanjeev Gera Recommends SanketLife ECG" },
  { id: "RfXpcoGsJlA", title: "Dr. Vanita Arora: SanketLife — Hero For Your Heart" },
  { id: "LW1dBopGYl4", title: "NEWS9 Live: Agatsa's Life-Saving SanketLife 2.0" },
  { id: "0bLpUCQw-Xc", title: "AIIMS Event — Simplifying Heart Care with SanketLife" },
  { id: "Ird2TuUR0j4", title: "Neha Rastogi at Medical Expo India 2024" },
  { id: "wocf2tnTLmE", title: "Patients & Doctors Embrace SanketLife Pro Plus" },
];

export function TrustVideosSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-[#7C4DFF] mb-2 font-semibold">
            Trusted by Experts
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Cardiologists, hospitals & national media on Agatsa
          </h2>
          <p className="mt-3 text-sm text-white/60 max-w-2xl mx-auto">
            Watch leading doctors and institutions vouch for the same devices that power Agatsa One.
          </p>
        </div>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {TRUST_VIDEOS.map((v) => (
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

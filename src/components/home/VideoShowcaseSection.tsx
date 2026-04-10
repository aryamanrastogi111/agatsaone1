import { useState } from "react";
import { Play } from "lucide-react";

const VIDEOS = [
  { id: "j8QwXnQwozg", title: "App Setup & Device Pairing" },
  { id: "m57UYezHL0U", title: "Why Rhythm, Not Just Numbers" },
  { id: "FSstgD0nujQ", title: "Stop Tracking, Start Understanding" },
  { id: "Ck8syb2uQdo", title: "Why Watch ECGs Aren't Enough" },
  { id: "TsFiHSnWAnI", title: "From Idea to Approval: MedTech in India" },
  { id: "e9f0DR890zM", title: "India: The Diabetes Capital" },
];

function VideoCard({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="min-w-[280px] sm:min-w-0 snap-start">
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="w-full h-full group cursor-pointer"
            aria-label={`Play ${title}`}
          >
            <img
              src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-primary/80 transition-colors">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
            </div>
          </button>
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-white/90">{title}</p>
    </div>
  );
}

export function VideoShowcaseSection() {
  return (
    <section className="py-20 md:py-28 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            See It In Action
          </h2>
          <p className="mt-3 text-lg text-white/60">
            Real demos, real results
          </p>
        </div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {VIDEOS.map((v) => (
            <VideoCard key={v.id} id={v.id} title={v.title} />
          ))}
        </div>

        {/* Channel link */}
        <div className="text-center mt-10">
          <a
            href="https://www.youtube.com/channel/UC_DEStSXEIIRQCFfj2ObS1g"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View all videos →
          </a>
        </div>
      </div>
    </section>
  );
}

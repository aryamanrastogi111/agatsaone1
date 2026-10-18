import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CHAPTERS = [
  { id: "discover", label: "Food & you" },
  { id: "science", label: "The science" },
  { id: "how-it-works", label: "How it works" },
  { id: "proof-video", label: "Inside the app" },
  { id: "buy", label: "Choose your band" },
];

export function RhythmScrollNav() {
  const [active, setActive] = useState("discover");
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-20% 0px -55% 0px" });
    for (const chapter of CHAPTERS) {
      const section = document.getElementById(chapter.id);
      if (section) observer.observe(section);
    }
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("rhythm-revealed"); reveal.unobserve(entry.target); }
    }, { threshold: 0.08 });
    document.querySelectorAll(".rhythm-section").forEach(section => { section.classList.add("rhythm-reveal"); reveal.observe(section); });
    return () => { observer.disconnect(); reveal.disconnect(); };
  }, []);
  return <nav className="rhythm-scroll-nav" aria-label="Explore Rhythm Band"><div className="rhythm-container flex items-center gap-1 overflow-x-auto py-2">
    <span className="mr-auto hidden whitespace-nowrap text-sm font-semibold md:block">EasyTouch Rhythm</span>
    {CHAPTERS.map(chapter => <Button key={chapter.id} asChild size="sm" variant="ghost" className={`shrink-0 text-xs ${active === chapter.id ? "bg-accent text-foreground" : "text-foreground"}`}><a href={`#${chapter.id}`} aria-current={active === chapter.id ? "location" : undefined}>{chapter.label}</a></Button>)}
  </div></nav>;
}
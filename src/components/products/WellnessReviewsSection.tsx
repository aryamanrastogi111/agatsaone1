import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, ChevronDown, User } from "lucide-react";
import { wellnessReviews, type WellnessReview } from "@/data/easytouchWellnessReviews";
import { Button } from "@/components/ui/button";

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} className={`h-3.5 w-3.5 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: WellnessReview }) => {
  const initials = review.name.split(" ").map(w => w[0]).join("").slice(0, 2);
  const dateLabel = new Date(review.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {review.hasAvatar && review.avatarUrl ? (
          <img src={review.avatarUrl} alt={review.name} className="w-9 h-9 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.city}</p>
        </div>
        <span className="text-xs text-muted-foreground/60 shrink-0">{dateLabel}</span>
      </div>
      <StarRow rating={review.rating} />
      <p className="text-sm font-medium text-foreground">{review.title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-[10px] text-green-600 font-medium">✓ Verified Purchase</span>
      </div>
    </div>
  );
};

type Filter = "all" | 5 | 4 | 3;

export function WellnessReviewsSection() {
  const [filter, setFilter] = useState<Filter>("all");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const list = filter === "all" ? wellnessReviews : wellnessReviews.filter(r => r.rating === filter);
    return showAll ? list : list.slice(0, 6);
  }, [filter, showAll]);

  const totalCount = wellnessReviews.length;
  const avgRating = (wellnessReviews.reduce((s, r) => s + r.rating, 0) / totalCount).toFixed(1);

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    wellnessReviews.forEach(r => counts[r.rating]++);
    return counts;
  }, []);

  return (
    <section className="py-12 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">What users are saying</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <StarRow rating={Math.round(Number(avgRating))} />
            <span className="text-lg font-bold text-foreground">{avgRating}</span>
            <span className="text-sm text-muted-foreground">based on {totalCount} reviews</span>
          </div>
        </motion.div>

        {/* Rating breakdown bar */}
        <motion.div {...fadeUp} className="mt-8 max-w-sm mx-auto space-y-1.5">
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-8 text-right text-muted-foreground">{star}★</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(ratingCounts[star] / totalCount) * 100}%` }} />
              </div>
              <span className="w-6 text-muted-foreground">{ratingCounts[star]}</span>
            </div>
          ))}
        </motion.div>

        {/* Filter chips */}
        <div className="flex gap-2 justify-center mt-8 flex-wrap">
          {(["all", 5, 4, 3] as Filter[]).map(f => (
            <button key={String(f)} onClick={() => { setFilter(f); setShowAll(false); }}
              className={`text-xs px-4 py-1.5 rounded-full font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {f === "all" ? "All" : `${f} Star`}
            </button>
          ))}
        </div>

        {/* Review grid */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {filtered.map((review, i) => (
            <motion.div key={review.name + review.date} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}>
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>

        {!showAll && (filter === "all" ? wellnessReviews.length : wellnessReviews.filter(r => r.rating === filter).length) > 6 && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => setShowAll(true)} className="rounded-full px-8">
              Show All Reviews <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

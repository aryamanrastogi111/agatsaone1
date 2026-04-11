// Re-export using generic component for backward compatibility
import { ProductReviewsSection } from "./ProductReviewsSection";
import { wellnessReviews } from "@/data/easytouchWellnessReviews";

export function WellnessReviewsSection() {
  return <ProductReviewsSection reviews={wellnessReviews} />;
}

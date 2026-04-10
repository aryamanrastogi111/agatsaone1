import { useEffect } from "react";

/**
 * Fires a Meta Pixel ViewContent event on mount for a product page.
 */
export function useMetaPixelViewContent(
  contentId: string,
  contentName: string,
  value: number,
  currency = "INR"
) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      try {
        (window as any).fbq("track", "ViewContent", {
          content_ids: [contentId],
          content_name: contentName,
          content_type: "product",
          value,
          currency,
        });
      } catch (e) {
        console.error("Meta Pixel ViewContent error:", e);
      }
    }
  }, [contentId, contentName, value, currency]);
}

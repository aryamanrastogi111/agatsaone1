import { useEffect, useCallback } from 'react';
import { isSaleActive } from '@/components/sale';

// Extend Window interface for Facebook Pixel
declare global {
  interface Window {
    fbq: (
      action: string,
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

// Product constants for EasyTouch Rhythm
const EASYTOUCH_RHYTHM = {
  contentId: 'easytouch-rhythm',
  contentName: 'EasyTouch Rhythm',
  contentType: 'product',
  currency: 'INR',
  regularPrice: 4999,
  salePrice: 4499,
};

/**
 * Hook for tracking Facebook Pixel events specifically for EasyTouch Rhythm product.
 * This ensures all ad tracking is isolated to this product only.
 */
export function useFacebookPixel() {
  const getPrice = useCallback(() => {
    return isSaleActive() ? EASYTOUCH_RHYTHM.salePrice : EASYTOUCH_RHYTHM.regularPrice;
  }, []);

  const trackPageView = useCallback(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'PageView');
      } catch (error) {
        console.error('Facebook Pixel PageView error:', error);
      }
    }
  }, []);

  const trackViewContent = useCallback(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'ViewContent', {
          content_name: EASYTOUCH_RHYTHM.contentName,
          content_ids: [EASYTOUCH_RHYTHM.contentId],
          content_type: EASYTOUCH_RHYTHM.contentType,
          value: getPrice(),
          currency: EASYTOUCH_RHYTHM.currency,
        });
      } catch (error) {
        console.error('Facebook Pixel ViewContent error:', error);
      }
    }
  }, [getPrice]);

  const trackAddToCart = useCallback((quantity: number = 1) => {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        const price = getPrice();
        window.fbq('track', 'AddToCart', {
          content_name: EASYTOUCH_RHYTHM.contentName,
          content_ids: [EASYTOUCH_RHYTHM.contentId],
          content_type: EASYTOUCH_RHYTHM.contentType,
          value: price * quantity,
          currency: EASYTOUCH_RHYTHM.currency,
          num_items: quantity,
        });
      } catch (error) {
        console.error('Facebook Pixel AddToCart error:', error);
      }
    }
  }, [getPrice]);

  const trackInitiateCheckout = useCallback((value: number, numItems: number) => {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'InitiateCheckout', {
          content_name: EASYTOUCH_RHYTHM.contentName,
          content_ids: [EASYTOUCH_RHYTHM.contentId],
          content_type: EASYTOUCH_RHYTHM.contentType,
          value,
          currency: EASYTOUCH_RHYTHM.currency,
          num_items: numItems,
        });
      } catch (error) {
        console.error('Facebook Pixel InitiateCheckout error:', error);
      }
    }
  }, []);

  return {
    trackPageView,
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
  };
}

/**
 * Hook to fire PageView and ViewContent on mount for EasyTouch Rhythm page.
 */
export function useEasyTouchRhythmPixelPageView() {
  const { trackPageView, trackViewContent } = useFacebookPixel();

  useEffect(() => {
    trackPageView();
    trackViewContent();
  }, [trackPageView, trackViewContent]);
}

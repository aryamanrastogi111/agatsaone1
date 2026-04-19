/**
 * Returns true when the current hostname is myeasytouch.com (or www variant).
 * Used to switch the app into a standalone EasyTouch-branded experience.
 *
 * Computed synchronously from window.location so SSR-safe fallback returns false.
 */
export function useIsMyEasyTouch(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  return host === "myeasytouch.com" || host === "www.myeasytouch.com";
}

/** Non-hook variant — same logic, usable outside React. */
export function isMyEasyTouchHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  return host === "myeasytouch.com" || host === "www.myeasytouch.com";
}

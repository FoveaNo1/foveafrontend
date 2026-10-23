// Whether the page should move: the system's setting, or `?motion=reduce` (app/(landing)/layout.tsx).
export function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    document.documentElement.hasAttribute("data-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { comingBack } from "../../lib/landing/place";

// On every page in the landing page's type: says when the landing page is about to be come back to from another
// page, so it opens where the reader left it (lib/landing/place.ts): a link home clicked ("Fovea" at the top, or any
// other), or Back or Forward arriving at it. A link to a place on it (/#download) goes there instead.
export default function ReturnWatch() {
  const path = usePathname();
  const last = useRef(path);
  useEffect(() => { last.current = path; }, [path]);

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const u = new URL(a.href, location.href);
      if (u.origin === location.origin && u.pathname === "/" && !u.hash && location.pathname !== "/") comingBack();
    };
    // before the router hears of it, so the landing page knows as it opens
    const pop = () => { if (location.pathname === "/" && !location.hash && last.current !== "/") comingBack(); };
    document.addEventListener("click", click, true);
    addEventListener("popstate", pop, true);
    return () => { document.removeEventListener("click", click, true); removeEventListener("popstate", pop, true); };
  }, []);

  return null;
}

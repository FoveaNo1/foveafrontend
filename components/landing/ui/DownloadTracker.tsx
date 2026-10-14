"use client";

import { useEffect } from "react";
import { track } from "../../../lib/landing/analytics";

// Counts clicks on any Download link on the page (they carry data-download="top|hero|closing"),
// so the buttons themselves can stay server-drawn.
export default function DownloadTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLElement>("[data-download]");
      if (link) track("download_clicked", { location: link.dataset.download ?? "unknown" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

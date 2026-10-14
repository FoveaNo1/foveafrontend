"use client";

import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { scenarioStore, useScenario } from "./scenarioStore";

// The demo. The server's still picture shows first; the live demo (its own chunk) loads once the
// page is up and takes over from the same frame. Which scenario it plays is shared with the words
// beside it (scenarioStore): a phrase there picks one, and a Watch run moves on to the next.

const LiveDemo = lazy(() => import("./LiveDemo"));

export default function DemoController({ poster, label }: { poster: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const scenario = useScenario();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLive(true);
      },
      { rootMargin: "600px 0px" },
    );
    near.observe(el);
    return () => near.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {live ? (
        <Suspense fallback={poster}>
          <LiveDemo scenario={scenario} label={label} onAdvance={scenarioStore.set} />
        </Suspense>
      ) : (
        poster
      )}
    </div>
  );
}

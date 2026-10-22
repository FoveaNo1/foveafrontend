"use client";

import TopBar from "../TopBar";
import { useCallback, useEffect, useState } from "react";
import type { Cycle } from "../../../lib/landing/book";
import SiteFoot from "../SiteFoot";
import CheckoutSheet from "./CheckoutSheet";
import DownloadBlock from "./DownloadBlock";
import Plans from "./Plans";
import Rotation from "./Rotation";
import Welcome from "./Welcome";

// The download page (/download): the download, a frame of four photographs in turn, the plans, and paying.
// Design and research: landing/research/drafts (get.html, research/*.md). Paying goes on to Stripe (CheckoutSheet);
// the welcome opens on /checkout/success once Pro is on.
export default function GetFovea() {
  const [sheet, setSheet] = useState<Cycle | null>(null);
  const [cycle, setCycle] = useState<Cycle>("yearly");
  const [preview, setPreview] = useState(false);

  const join = useCallback((c: Cycle) => { setCycle(c); setSheet(c); }, []);
  const closeSheet = useCallback(() => setSheet(null), []);
  const closePreview = useCallback(() => setPreview(false), []);

  // ?preview=welcome (or sheet) opens that step, to look at the design without paying
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("preview");
    const t = window.setTimeout(() => { if (p === "welcome") setPreview(true); if (p === "sheet") setSheet("yearly"); }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <TopBar />
      <main>
        <section className="gp-dl" aria-label="Download">
          <DownloadBlock />
          <Rotation />
        </section>
        <Plans onJoin={join} />
      </main>
      <SiteFoot />
      <CheckoutSheet open={sheet !== null} cycle={cycle} onClose={closeSheet} />
      <Welcome open={preview} onClose={closePreview} demo />
    </>
  );
}

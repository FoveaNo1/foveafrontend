"use client";

import TopBar from "../TopBar";
import SiteFoot from "../SiteFoot";
import DownloadBlock from "./DownloadBlock";
import Rotation from "./Rotation";

// The download page (/download): the download and a frame of four photographs in turn. Design and research:
// landing/research/drafts (get.html, research/*.md). Pricing and checkout live on their own pages.
export default function GetFovea() {
  return (
    <>
      <TopBar />
      <main>
        <section className="gp-dl" aria-label="Download">
          <DownloadBlock />
          <Rotation />
        </section>
      </main>
      <SiteFoot />
    </>
  );
}

"use client";

import TopBar from "../TopBar";
import SiteFoot from "../SiteFoot";
import DownloadBlock from "./DownloadBlock";
import Rotation from "./Rotation";

// The download page (/download): the download and a frame of four photographs in turn. Design and research:
// landing/research/drafts (get.html, research/*.md). Nov 8 (Yulun: "remove pricing, we will go with free trial"): no
// plans and no paying; Fovea is a free trial.
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

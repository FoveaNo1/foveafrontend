"use client";

import { useEffect, useRef, useState } from "react";
import { DMG_URL, REQUIREMENTS } from "../../../lib/download";

// The download, as a line of type. It is a real link to the DMG; pressing it also draws a short line under it and,
// a moment later, opens the three install steps beneath (they hold their place from the start, so nothing jumps).
export default function DownloadBlock() {
  const [state, setState] = useState<"idle" | "starting" | "started">("idle");
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = () => {
    if (state === "starting") return;
    setState("starting");
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("started"), 900);
  };

  return (
    <div>
      <h1 className="rise">Talk to your agents from the notch.</h1>
      <p className="lede rise" style={{ ["--i" as string]: 1 }}>Works with Claude Code and Codex, in preview. More are coming.</p>
      <div className="gp-act rise" style={{ ["--i" as string]: 2 }}>
        <a className="act-line down" href={DMG_URL} download onClick={onClick} data-download="download-page" aria-describedby="dl-req">
          <span className="swap" key={state}>
            {state === "idle" && <>Download for Mac <span className="ar" aria-hidden="true">↓</span></>}
            {state === "starting" && <>Starting</>}
            {state === "started" && <>Your download has started <span className="ar" aria-hidden="true">✓</span></>}
          </span>
        </a>
        <span className={`progress${state !== "idle" ? " on" : ""}`} aria-hidden="true"><i /></span>
        <span className="req" id="dl-req" aria-live="polite">
          {state === "started" ? "Fovea.dmg · in your Downloads folder" : `${REQUIREMENTS} · Free to start`}
        </span>
      </div>
      <ol className={`install${state === "started" ? " on" : ""}`} aria-hidden={state !== "started"}>
        <li><i>a.</i>Open Fovea.dmg<small>It is in your Downloads folder.</small></li>
        <li><i>b.</i>Move Fovea into Applications</li>
        <li><i>c.</i>Open Fovea and sign in<small>It asks for the microphone and screen recording, once.</small></li>
      </ol>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { BookCopy as c } from "../../../lib/landing/bookCopy";
import type { SceneId } from "../../../lib/landing/film/showcase";
import "./showcase.css";

const Demo = dynamic(() => import("./Demo"), { ssr: false });

// After the film (Oct 24, Yulun): what Fovea does today, one thing at a time, set out as Dia's site sets out its
// features (diabrowser.com, read Oct 24): the list held 20% down the screen beside the pictures, blank space between
// the pictures; an item lit, its words opening under it, once its picture's top passes 40% of the screen; a click on
// an item brings its picture up beside the list. Here each picture is a scene of someone doing the
// thing on their Mac (Demo.tsx), and only the reader's one plays, from the desk at rest each time it becomes theirs.
// On a narrow screen the list goes: each scene with its words under it, and the one nearest the middle plays.

const NARROW = "(max-width: 899px)";

export default function Showcase() {
  const items = c.showcase.items;
  const demos = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = demos.current;
    if (!el) return;
    // the scenes are drawn once the showcase is within a screen of the viewport
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMounted(true); near.disconnect(); } }, { rootMargin: "100% 0px" });
    near.observe(el);
    // they play only while the scenes are on screen and the page is in front
    let onScreen = false;
    const look = () => setLive(onScreen && !document.hidden);
    const seen = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; look(); });
    seen.observe(el);
    document.addEventListener("visibilitychange", look);
    // whose turn it is: wide, the last picture whose top has passed 40% of the screen; narrow, the nearest the middle
    let raf = 0;
    const pick = () => {
      raf = 0;
      const H = innerHeight;
      let i = 0;
      if (matchMedia(NARROW).matches) {
        let best = Infinity;
        frames.current.forEach((f, k) => {
          if (!f) return;
          const r = f.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - H / 2);
          if (d < best) { best = d; i = k; }
        });
      } else frames.current.forEach((f, k) => { if (f && f.getBoundingClientRect().top <= H * 0.4) i = k; });
      setActive(i);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(pick); };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    pick();
    return () => {
      near.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", look);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /** An item's picture brought up beside the list: its top a little above the list's (20% down). */
  const go = (i: number) => {
    const f = frames.current[i];
    if (!f) return;
    const top = f.getBoundingClientRect().top + scrollY - innerHeight * 0.2 + 20;
    scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section className="sc-sec" aria-labelledby="sc-h">
      <h2 id="sc-h" className="sc-h">{c.showcase.title}</h2>
      <div className="sc-grid">
        <div className="sc-side">
          <ol className="sc-list">
            {items.map((it, i) => (
              <li key={it.id}>
                <button type="button" className={`sc-item${i === active ? " on" : ""}`} aria-current={i === active ? "true" : undefined} onClick={() => go(i)}>
                  <span className="sc-bar" aria-hidden="true" />
                  <span className="sc-num">{i + 1}</span>
                  <span className="sc-t">{it.title}</span>
                  <span className="sc-more"><span><span className="sc-d">{it.text}</span></span></span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div ref={demos} className="sc-demos">
          {items.map((it, i) => (
            <figure key={it.id} className="sc-demo">
              <div ref={(f) => { frames.current[i] = f; }} className="sc-frame">
                {mounted && <Demo id={it.id as SceneId} play={live && i === active} label={it.label} />}
              </div>
              <figcaption className="sc-cap">
                <span className="sc-num">{i + 1}</span>
                <span className="sc-t">{it.title}</span>
                <span className="sc-d">{it.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

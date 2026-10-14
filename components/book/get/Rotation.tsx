"use client";

import { useEffect, useRef } from "react";
import { Pictures, sized } from "../../../lib/landing/book";

// One frame, four photographs in turn (research/rotation.md, design 1, "drift").
// One clock: the current dot's fill runs 6 s, and when it finishes the next photograph dissolves in over 1.8 s on top
// of the old one, which stays opaque beneath (no dip to paper). Each settles from 1.06 to 1 along its own motion.
// Pointing at the frame or the dots, or focusing a dot, holds everything where it is; a dot takes you to its
// photograph and the turn carries on from there; a swipe moves one. Only while on screen and the tab is visible.
// With reduced motion nothing moves on its own and a change is a 200 ms fade.

const DWELL = 6000, FADE = 1800;
const EASE_IO = "cubic-bezier(0.45, 0, 0.55, 1)", EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function Rotation() {
  const rotRef = useRef<HTMLElement>(null);
  const dotsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rot = rotRef.current, dotsEl = dotsRef.current;
    if (!rot || !dotsEl) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const slides = [...rot.querySelectorAll<HTMLElement>(".slide")];
    const dots = [...dotsEl.querySelectorAll<HTMLButtonElement>(".dot")];
    let cur = 0, fill: Animation | null = null, hoverHold = false, inView = true, dead = false;
    let tx: { prev: HTMLElement; next: HTMLElement; anims: Animation[] } | null = null;
    const drifts = new Map<HTMLElement, Animation>();
    const decoded = slides.map((s) => s.querySelector("img")!.decode().catch(() => {}));
    const held = () => hoverHold || !inView || document.hidden;

    const setDots = (i: number) => dots.forEach((d, k) => {
      d.classList.toggle("on", k === i);
      if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
    const drift = (s: HTMLElement) => {
      drifts.get(s)?.cancel();
      if (reduce) return;
      const a = s.querySelector("img")!.animate(
        [{ transform: `scale(1.06) translate(${s.dataset.dx}, ${s.dataset.dy})` }, { transform: "scale(1) translate(0, 0)" }],
        { duration: DWELL + 2 * FADE, easing: "linear", fill: "forwards" },
      );
      drifts.set(s, a);
      if (held()) a.pause();
    };
    const runFill = () => {
      fill?.cancel();
      const bar = dots[cur].querySelector("i")!;
      if (reduce) { bar.style.setProperty("--f", "1"); fill = null; return; }
      fill = bar.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { pseudoElement: "::after", duration: DWELL, easing: "linear", fill: "forwards" });
      const mine = fill;
      fill.finished.then(() => { if (fill === mine && !dead) go((cur + 1) % slides.length, false); }).catch(() => {});
      if (held()) fill.pause();
    };
    const live = (a: Animation | null) => a && a.playState !== "finished" && a.playState !== "idle";
    const sync = () => {
      const h = held();
      [fill, ...(tx ? tx.anims : []), ...drifts.values()].forEach((a) => { if (live(a)) { if (h) a!.pause(); else a!.play(); } });
    };
    const settle = () => {
      if (!tx) return;
      const { prev, next, anims } = tx; tx = null;
      anims.forEach((a) => a.cancel());
      prev.classList.remove("prev", "on"); prev.setAttribute("inert", "");
      drifts.get(prev)?.cancel(); drifts.delete(prev);
      next.classList.remove("next"); next.classList.add("on");
    };
    const go = async (i: number, user: boolean) => {
      if (i === cur) return;
      settle();
      const prev = slides[cur], next = slides[i];
      cur = i; setDots(i);
      await decoded[i];
      if (dead || slides[cur] !== next) return;
      settle();
      slides.forEach((s) => { if (s !== prev && s !== next) { s.classList.remove("on", "prev", "next"); s.setAttribute("inert", ""); } });
      prev.classList.remove("on"); prev.classList.add("prev");
      next.classList.add("next"); next.removeAttribute("inert");
      const my = (tx = { prev, next, anims: [] as Animation[] });
      my.anims.push(next.animate([{ opacity: 0 }, { opacity: 1 }],
        reduce ? { duration: 200, easing: "ease", fill: "forwards" } : user ? { duration: 900, easing: EASE_OUT, fill: "forwards" } : { duration: FADE, easing: EASE_IO, fill: "forwards" }));
      drift(next);
      runFill();
      if (held()) my.anims.forEach((a) => a.pause());
      await Promise.all(my.anims.map((a) => a.finished.catch(() => {})));
      if (tx === my) settle();
    };

    const hold = (on: boolean) => { hoverHold = on; sync(); };
    const enter = (e: PointerEvent) => { if (e.pointerType !== "touch") hold(true); };
    const leave = () => hold(false);
    const focusIn = () => hold(true);
    const focusOut = () => hold(false);
    const onDot = (e: MouseEvent) => { const d = (e.target as Element).closest<HTMLButtonElement>(".dot"); if (d) go(Number(d.dataset.i), true); };
    let sx0: number | null = null, st0 = 0;
    const down = (e: PointerEvent) => { if (e.pointerType === "touch") { sx0 = e.clientX; st0 = performance.now(); } };
    const up = (e: PointerEvent) => {
      if (sx0 === null) return;
      const dx = e.clientX - sx0, v = Math.abs(dx) / Math.max(1, performance.now() - st0); sx0 = null;
      if (Math.abs(dx) > 56 || v > 0.35) go((cur + (dx < 0 ? 1 : slides.length - 1)) % slides.length, true);
    };
    const keys = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") go((cur + (e.key === "ArrowRight" ? 1 : slides.length - 1)) % slides.length, true);
    };

    [rot, dotsEl].forEach((el) => { el.addEventListener("pointerenter", enter); el.addEventListener("pointerleave", leave); });
    dotsEl.addEventListener("focusin", focusIn);
    dotsEl.addEventListener("focusout", focusOut);
    dotsEl.addEventListener("click", onDot);
    dotsEl.addEventListener("keydown", keys);
    rot.addEventListener("pointerdown", down);
    rot.addEventListener("pointerup", up);
    const io = new IntersectionObserver((es) => { inView = es[0].intersectionRatio >= 0.6; sync(); }, { threshold: [0, 0.6] });
    io.observe(rot);
    document.addEventListener("visibilitychange", sync);
    drift(slides[0]);
    runFill();

    return () => {
      dead = true;
      [rot, dotsEl].forEach((el) => { el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); });
      dotsEl.removeEventListener("focusin", focusIn);
      dotsEl.removeEventListener("focusout", focusOut);
      dotsEl.removeEventListener("click", onDot);
      dotsEl.removeEventListener("keydown", keys);
      rot.removeEventListener("pointerdown", down);
      rot.removeEventListener("pointerup", up);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      fill?.cancel();
      tx?.anims.forEach((a) => a.cancel());
      drifts.forEach((a) => a.cancel());
    };
  }, []);

  return (
    <figure className="plate">
      <section ref={rotRef} className="rot grain" aria-roledescription="carousel" aria-label="Photographs">
        {Pictures.rotation.map((p, i) => (
          <figure key={p.src} className={`slide${i === 0 ? " on" : ""}`} data-dx={p.dx} data-dy={p.dy} role="group" aria-roledescription="slide"
            aria-label={`${i + 1} of ${Pictures.rotation.length}`} inert={i !== 0} style={{ ["--origin" as string]: p.origin }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- stand-in hotlinked pictures (lib/landing/book.ts) */}
            <img src={sized(p.src, p.w)} alt={p.alt} style={{ objectPosition: p.pos }} fetchPriority={i === 0 ? "high" : "auto"} />
          </figure>
        ))}
      </section>
      <figcaption>
        <span ref={dotsRef} className="dots" role="group" aria-label="Choose a photograph (it pauses while you point at it)">
          {Pictures.rotation.map((p, i) => (
            <button key={p.src} type="button" className={`dot${i === 0 ? " on" : ""}`} data-i={i}
              aria-label={`Photograph ${i + 1} of ${Pictures.rotation.length}: ${p.name}`} aria-current={i === 0 ? "true" : undefined}>
              <i />
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

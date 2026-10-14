"use client";

import { useEffect, useRef } from "react";

// A photograph whose own warm light comes on while the pointer is over it and wanes when it leaves, like a lamp:
// it brightens first and its colour fills in after; cooling, it dims first and its colour holds, deepening toward
// ember before it goes grey. The halo arrives last and leaves first. A quick pass across it only half wakes it.
// Touch screens have no hover, so there the light comes on by itself shortly after arrival; a tap toggles it.
// `lightsPage` also writes the light to <html> as --lit, so the page can warm with it.
// Research: landing/research/drafts/research/hover-light.md. Styles: app/(landing)/book.css (.room).

type Props = {
  src: string;
  alt: string;
  /** The light's centre (x, y as fractions of the picture) and radius (as a fraction of its width). */
  sun: readonly [number, number, number];
  /** The picture's natural size, to place the light under object-fit: cover. */
  size: readonly [number, number];
  /** object-position, e.g. "50% 0%". */
  pos?: string;
  lightsPage?: boolean;
  className?: string;
};

const RISE = 2.6, FALL = 1.1; // per second, exponential approach: about 0.9 s to warm, 2.1 s to cool

export default function Room({ src, alt, sun, size, pos = "50% 50%", lightsPage = false, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const room = ref.current, sunBtn = sunRef.current;
    if (!room || !sunBtn) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const page = lightsPage ? document.documentElement : null;
    const [cx, cy, r] = sun, [iw, ih] = size;
    let sx = 0, sy = 0, sr = 1, lit = 0, target = 0, raf = 0, last = 0, held = false, near = 0;
    let gx = 0, gy = 0, tgx = 0, tgy = 0, b = 0, s = 0;
    let lastMove = 0, lastX = 0, lastY = 0, restTimer = 0, autoTimer = 0;
    let lastType = "mouse";

    const paint = () => {
      const v = lit.toFixed(3);
      room.style.setProperty("--lit", v);
      if (page) page.style.setProperty("--lit", v);
      room.style.setProperty("--lb", b.toFixed(3));
      room.style.setProperty("--ls", s.toFixed(3));
      room.style.setProperty("--ember", Math.max(0, s - b).toFixed(3));
      room.style.setProperty("--halo", Math.pow(Math.min(b, s), 2.2).toFixed(3));
      room.style.setProperty("--gx", gx.toFixed(1) + "px");
      room.style.setProperty("--gy", gy.toFixed(1) + "px");
    };
    const layout = () => {
      const W = room.clientWidth, H = room.clientHeight, k = Math.max(W / iw, H / ih);
      const dw = iw * k, dh = ih * k;
      const [px, py] = pos.split(/\s+/).map((v) => parseFloat(v) / 100);
      sx = (W - dw) * (isNaN(px) ? 0.5 : px) + cx * dw;
      sy = (H - dh) * (isNaN(py) ? 0.5 : py) + cy * dh;
      sr = r * dw;
      if (!raf) { gx = tgx = sx; gy = tgy = sy; }
      room.style.setProperty("--sx", sx + "px");
      room.style.setProperty("--sy", sy + "px");
      room.style.setProperty("--sr", sr + "px");
      paint();
    };
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      lit += (target - lit) * (1 - Math.exp(-dt * (target > lit ? RISE : FALL)));
      const up = target > lit;
      b += (target - b) * (1 - Math.exp(-dt * (up ? 4.2 : 1.7)));
      s += (target - s) * (1 - Math.exp(-dt * (up ? 1.9 : 0.85)));
      gx += (tgx - gx) * (1 - Math.exp(-dt * 6));
      gy += (tgy - gy) * (1 - Math.exp(-dt * 6));
      const settled = Math.abs(target - lit) < 0.002 && Math.abs(target - b) < 0.002 && Math.abs(target - s) < 0.002 && Math.abs(tgx - gx) < 0.5 && Math.abs(tgy - gy) < 0.5;
      if (settled) { lit = b = s = target; gx = tgx; gy = tgy; raf = 0; last = 0; } else raf = requestAnimationFrame(step);
      paint();
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
    const aim = (t: number) => {
      target = t;
      if (reduce) { lit = b = s = t; gx = tgx; gy = tgy; paint(); return; }
      kick();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = room.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      const now = performance.now();
      const speed = lastMove ? Math.hypot(e.clientX - lastX, e.clientY - lastY) / Math.max(1, now - lastMove) : 0;
      lastMove = now; lastX = e.clientX; lastY = e.clientY;
      near = inside ? (speed > 1.5 ? Math.max(lit, 0.35) : 1) : 0;
      clearTimeout(restTimer);
      if (inside && speed > 1.5) restTimer = window.setTimeout(() => { near = 1; if (!held) aim(1); }, 140);
      // the bloom leans a fifth of the way toward the pointer, so the sun stays its source
      if (inside) { tgx = sx + (x - sx) * 0.2; tgy = sy + (y - sy) * 0.2; } else { tgx = sx; tgy = sy; }
      if (!held) aim(near); else kick();
    };
    const onLeave = () => { clearTimeout(restTimer); lastMove = 0; near = 0; tgx = sx; tgy = sy; if (!held) aim(0); else kick(); };
    const onDown = (e: PointerEvent) => { lastType = e.pointerType; };
    const onClick = (e: MouseEvent) => {
      if (lastType !== "touch" && e.target !== sunBtn) return;
      held = !held;
      aim(held ? 1 : lastType === "touch" ? 0 : near);
      sunBtn.setAttribute("aria-pressed", String(held));
    };
    const onFocus = () => aim(1);
    const onBlur = () => { if (!held) aim(0); };

    room.addEventListener("pointermove", onMove);
    room.addEventListener("pointerleave", onLeave);
    room.addEventListener("pointerdown", onDown);
    room.addEventListener("click", onClick);
    sunBtn.addEventListener("focus", onFocus);
    sunBtn.addEventListener("blur", onBlur);
    const ro = new ResizeObserver(layout);
    ro.observe(room);
    layout();
    if (matchMedia("(hover: none)").matches) autoTimer = window.setTimeout(() => { if (!held && target === 0) { held = true; aim(1); } }, 1100);

    return () => {
      room.removeEventListener("pointermove", onMove);
      room.removeEventListener("pointerleave", onLeave);
      room.removeEventListener("pointerdown", onDown);
      room.removeEventListener("click", onClick);
      sunBtn.removeEventListener("focus", onFocus);
      sunBtn.removeEventListener("blur", onBlur);
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(restTimer);
      clearTimeout(autoTimer);
      if (page) page.style.removeProperty("--lit");
    };
  }, [sun, size, pos, lightsPage]);

  return (
    <div ref={ref} className={`room ${className}`} style={{ ["--pos" as string]: pos }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a stand-in hotlinked picture (lib/landing/book.ts) */}
      <img className="room-lit" src={src} alt={alt} fetchPriority="high" />
      <div className="room-glow" />
      <div className="room-rim" />
      <button ref={sunRef} className="room-sun" type="button" aria-label="Turn on the light" aria-pressed="false" />
    </div>
  );
}

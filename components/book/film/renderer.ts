// Applies a frame of the film (lib/landing/film/film.ts) to the DOM: every element marked data-k gets what the frame
// says about it, and only what changed is written. A part the frame doesn't mention goes back to its stylesheet and
// markup (inline styles cleared, its first text and state restored), so seeking anywhere is exact. Nothing here reads
// layout.

import type { Frame, P } from "../../../lib/landing/film/film";

type Rec = { el: HTMLElement | SVGElement; path: SVGPathElement | null; text0: string | null; st0: string | null; last: Record<string, string>; vars: Set<string> };

const r3 = (n: number) => Math.round(n * 1000) / 1000;
const r2 = (n: number) => Math.round(n * 100) / 100;

function transformOf(p: P): string {
  if (p.x === undefined && p.y === undefined && p.s === undefined && p.sx === undefined && p.sy === undefined && p.r === undefined) return "";
  let t = `translate3d(${r2(p.x ?? 0)}px,${r2(p.y ?? 0)}px,0)`;
  if (p.r) t += ` rotate(${r2(p.r)}deg)`;
  if (p.sx !== undefined || p.sy !== undefined) t += ` scale(${r3(p.sx ?? p.s ?? 1)},${r3(p.sy ?? p.s ?? 1)})`;
  else if (p.s !== undefined) t += ` scale(${r3(p.s)})`;
  return t;
}

export function makeRenderer(root: HTMLElement) {
  const recs = new Map<string, Rec>();
  // the still copy of the desk (the whole-screen capture's picture) is never moved by the film
  const all = [...(root.hasAttribute("data-k") ? [root] : []), ...root.querySelectorAll<HTMLElement | SVGElement>("[data-k]")].filter((el) => !el.closest("[data-still]"));
  all.forEach((el) => {
    const k = el.getAttribute("data-k")!;
    recs.set(k, {
      el,
      path: el instanceof SVGPathElement ? el : el.querySelector("path"),
      text0: el.hasAttribute("data-text") ? el.textContent : null,
      st0: el.getAttribute("data-state"),
      last: {},
      vars: new Set(),
    });
  });

  const put = (rec: Rec, prop: string, value: string, write: (v: string) => void) => {
    if (rec.last[prop] === value) return;
    // never clear what the markup set and the film has not touched
    if (rec.last[prop] === undefined && value === "") { rec.last[prop] = ""; return; }
    rec.last[prop] = value;
    write(value);
  };

  const EMPTY: P = {};
  return {
    keys: () => [...recs.keys()],
    apply(frame: Frame, world: HTMLElement | null, fit: { s: number; tx: number; ty: number }) {
      if (world) {
        const v = `translate3d(${r2(fit.tx)}px,${r2(fit.ty)}px,0) scale(${r3(fit.s)})`;
        if (world.dataset.t !== v) { world.dataset.t = v; world.style.transform = v; }
      }
      for (const [k, rec] of recs) {
        const p = frame.k[k] ?? EMPTY;
        const st = (rec.el as HTMLElement).style;
        put(rec, "o", p.o === undefined ? "" : String(r3(p.o)), (v) => { st.opacity = v; st.visibility = v !== "" && +v <= 0.001 ? "hidden" : ""; });
        put(rec, "tf", transformOf(p), (v) => { st.transform = v; });
        put(rec, "w", p.w === undefined ? "" : `${r2(p.w)}px`, (v) => { st.width = v; });
        put(rec, "h", p.h === undefined ? "" : `${r2(p.h)}px`, (v) => { st.height = v; });
        put(rec, "z", p.z === undefined ? "" : String(p.z), (v) => { st.zIndex = v; });
        put(rec, "blur", p.blur ? `blur(${r2(p.blur)}px)` : "", (v) => { st.filter = v; });
        put(rec, "clip", p.clip ?? "", (v) => { st.clipPath = v; (st as unknown as Record<string, string>).webkitClipPath = v; });
        if (rec.path) put(rec, "d", p.d ?? "", (v) => { if (v) rec.path!.setAttribute("d", v); });
        if (rec.text0 !== null || p.text !== undefined) put(rec, "text", p.text ?? rec.text0 ?? "", (v) => { rec.el.textContent = v; });
        put(rec, "st", p.st ?? rec.st0 ?? "", (v) => { if (v) rec.el.setAttribute("data-state", v); else rec.el.removeAttribute("data-state"); });
        const vars = p.v ? Object.keys(p.v) : [];
        for (const name of rec.vars) if (!p.v || !(name in p.v)) { st.removeProperty(name); delete rec.last[`v${name}`]; rec.vars.delete(name); }
        for (const name of vars) {
          const value = String(p.v![name]);
          rec.vars.add(name);
          put(rec, `v${name}`, value, (v) => st.setProperty(name, v));
        }
      }
    },
  };
}

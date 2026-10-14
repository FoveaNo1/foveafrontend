"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_PAPER, PAPER_KEY, Papers } from "../../lib/landing/paper";

// A small tool for choosing the paper colour: a swatch at the bottom right; open it to try the options, or any
// colour, across the whole site. The choice is kept in this browser and applied before paint (layout.tsx).
// It shows while developing; on the live site only with ?paper in the address. Not part of the design.

const apply = (hex: string) => document.documentElement.style.setProperty("--paper", hex);

export default function PaperPanel({ always }: { always: boolean }) {
  const [visible, setVisible] = useState(always);
  const [open, setOpen] = useState(false);
  const [paper, setPaper] = useState(DEFAULT_PAPER);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      let saved: string | null = null;
      try { saved = localStorage.getItem(PAPER_KEY); } catch {}
      if (saved) setPaper(saved);
      if (!always && new URLSearchParams(location.search).has("paper")) setVisible(true);
    }, 0);
    return () => clearTimeout(t);
  }, [always]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    addEventListener("keydown", onKey); addEventListener("pointerdown", onDown);
    return () => { removeEventListener("keydown", onKey); removeEventListener("pointerdown", onDown); };
  }, [open]);

  const choose = (hex: string) => {
    const h = hex.toUpperCase();
    setPaper(h); apply(h);
    try { if (h === DEFAULT_PAPER) localStorage.removeItem(PAPER_KEY); else localStorage.setItem(PAPER_KEY, h); } catch {}
  };

  if (!visible) return null;
  const current = Papers.find((p) => p.hex === paper);
  return (
    <div ref={root} className={`paper-panel${open ? " open" : ""}`}>
      {open && (
        <div className="pp-sheet" role="dialog" aria-label="Paper colour">
          <p className="pp-title">Paper</p>
          <div className="pp-list" role="radiogroup" aria-label="Paper colours">
            {Papers.map((p) => (
              <button key={p.hex} type="button" role="radio" aria-checked={paper === p.hex} className="pp-item" onClick={() => choose(p.hex)} title={p.note}>
                <span className="pp-sw" style={{ background: p.hex }} />
                <span className="pp-name">{p.name}</span>
                <span className="pp-hex">{p.hex}</span>
              </button>
            ))}
          </div>
          <div className="pp-foot">
            <label className="pp-custom">
              <input type="color" value={paper.length === 7 ? paper.toLowerCase() : "#fafafa"} onChange={(e) => choose(e.target.value)} aria-label="Any colour" />
              <span>Any colour</span>
            </label>
            <button type="button" className="pp-reset" onClick={() => choose(DEFAULT_PAPER)}>Reset</button>
          </div>
          {current && <p className="pp-note">{current.note}</p>}
        </div>
      )}
      <button type="button" className="pp-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="pp-sw" style={{ background: paper }} />
        <span>{current ? current.name : paper}</span>
      </button>
    </div>
  );
}

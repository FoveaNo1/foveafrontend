"use client";

import { useEffect, useRef, useState } from "react";
import { Founding, Pictures, sized } from "../../../lib/landing/book";

// After paying: the welcome card arrives unlit, then the hall inside it warms on (light before colour);
// its words appear and the letter follows. It opens on /checkout/success only after the backend confirms Pro.
// The optional design preview (`demo`) still uses a sample number and print/credits controls.

type Props = {
  open: boolean;
  onClose: () => void;
  /** The design preview: a sample number, the print offer and the credits. */
  demo?: boolean;
  /** "Open Fovea": the app's link, with the Checkout session when there is one. */
  appLink?: string;
};

export default function Welcome({ open, onClose, demo = false, appLink = "fovea://billing/success" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [set, setSet] = useState(false);
  const [shown, setShown] = useState(false);
  const [print, setPrint] = useState<"ask" | "yes" | "no">("ask");

  useEffect(() => {
    const el = root.current, c = card.current;
    if (!open || !el || !c) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    el.scrollTop = 0;
    document.documentElement.style.overflow = "hidden";
    el.focus({ preventScroll: true });
    let raf = 0;
    const start = performance.now() + (reduce ? 0 : 650), D = reduce ? 1 : 1200;
    const warm = (now: number) => {
      const p = Math.max(0, Math.min(1, (now - start) / D)), e = 1 - Math.pow(1 - p, 3);
      el.style.setProperty("--wl", e.toFixed(3));
      c.style.setProperty("--wl", e.toFixed(3));
      c.style.setProperty("--wb", (1 - Math.pow(1 - p, 4)).toFixed(3));
      c.style.setProperty("--ws", (p * p).toFixed(3));
      if (p < 1) raf = requestAnimationFrame(warm);
    };
    raf = requestAnimationFrame(warm);
    const t1 = window.setTimeout(() => setSet(true), reduce ? 0 : 1300);
    const t2 = window.setTimeout(() => setShown(true), reduce ? 0 : 1500);
    // the card leans a degree or two toward the pointer, and the light's reflection moves across it
    const tilt = (e: PointerEvent) => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      const cx = Math.max(-1, Math.min(1, x * 2 - 1)), cy = Math.max(-1, Math.min(1, y * 2 - 1));
      c.style.setProperty("--ry", (cx * 2).toFixed(2) + "deg"); c.style.setProperty("--rx", (-cy * 1.6).toFixed(2) + "deg");
      c.style.setProperty("--mx", (x * 100).toFixed(1) + "%"); c.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    };
    const untilt = () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); };
    if (!reduce && fine) { el.addEventListener("pointermove", tilt); el.addEventListener("pointerleave", untilt); }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2);
      el.removeEventListener("pointermove", tilt); el.removeEventListener("pointerleave", untilt);
      removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      setSet(false); setShown(false);
    };
  }, [open, onClose]);

  const no = demo ? `No. ${Founding.sampleNumber}` : null;
  const since = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date());
  return (
    <div ref={root} className={`welcome${open ? " open" : ""}${shown ? " shown" : ""}`} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="w-title" aria-hidden={!open} inert={!open}>
      <div className="w-in">
        <div className="card-wrap">
          <div ref={card} className={`mcard${set ? " set" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- a stand-in hotlinked picture (lib/landing/book.ts) */}
            <div className="ph"><img src={sized(Pictures.hall.src, 800)} alt="" /></div>
            <div className="tx">
              <div><b>Fovea Pro</b><span className="nm">Ready on your Mac</span><small suppressHydrationWarning>Since {since} · Fovea</small></div>
              {no && <span className="no">{no}</span>}
            </div>
            <div className="sheen" />
          </div>
        </div>
        <div className="w-txt">
          <h2 id="w-title">Welcome to Fovea.</h2>
          <p>Pro is on. Open Fovea on your Mac and it is already there.</p>
        </div>
        <article className="letter" aria-label="A letter from Fovea">
          <p>Hello,</p>
          <p>Thank you for choosing Fovea Pro.{no && ` You are ${no}.`}</p>
          <p>Pro is active on your account. Open Fovea on your Mac with the same account to use it.</p>
          <p>You can manage your subscription from your account on hellofovea.com.</p>
          <p>If you need help, email hello@hellofovea.com.</p>
          <p className="sig" aria-label="Signed, Fovea">Fovea</p>
          <p className="from">From all of us at Fovea</p>
        </article>
        {demo && <div className="after">
          <div>
            {print === "ask" && (
              <>
                <p>We’d like to send you the hall, printed, with this letter on paper. If you’d like it, tell us where.</p>
                <div className="act">
                  <button className="act-line small" type="button" onClick={() => setPrint("yes")}>Send it to me <span className="ar" aria-hidden="true">→</span></button>
                  <button className="quiet-link" type="button" onClick={() => setPrint("no")}>Not now</button>
                </div>
              </>
            )}
            {print === "yes" && <p className="sent">Thank you. We will write to ask where to send it.</p>}
            {print === "no" && <p className="sent">You can ask for it any time from your account.</p>}
          </div>
          <div>
            <label className="check"><input type="checkbox" /><span /><p>Add my name to the founding members in Fovea’s credits.</p></label>
          </div>
        </div>}
        <div className="w-end">
          <a className="act-line" href={appLink}>Open Fovea <span className="ar" aria-hidden="true">→</span></a>
          <button className="quiet-link" type="button" onClick={onClose}>Back to the page</button>
        </div>
      </div>
    </div>
  );
}

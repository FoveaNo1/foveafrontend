"use client";

import { useEffect, useRef, useState } from "react";
import { Founding, Pictures, sized } from "../../../lib/landing/book";

// After paying: the founding card arrives unlit, then the hall inside it warms on, as the landing page's does
// (light before colour); then its words are set, the number last, and the rest follows: a letter, the hall in
// print, the credits. research/rewards.md (the post-payment moment) and research/emil.md (the numbers).
// Oct 21: it opens for real on /checkout/success once the backend says Pro is on. Nothing yet keeps a founding
// number, a print request or a name for the credits, so a real welcome shows no number and doesn't offer those;
// the design preview (/download?preview=welcome, `demo`) still shows all of it.

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
  const [name, setName] = useState("");
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
              <div><b>Founding member</b><span className="nm">{name.trim()}</span><small suppressHydrationWarning>Since {since} · Fovea</small></div>
              {no && <span className="no">{no}</span>}
            </div>
            <div className="sheen" />
          </div>
        </div>
        <div className="w-txt">
          <h2 id="w-title">Welcome to Fovea.</h2>
          <p>Pro is on. Open Fovea on your Mac and it is already there. Your founding price is kept for as long as you stay.</p>
          <label className="namefield">
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name, for your card" maxLength={40} />
            <span>It is only on your card.</span>
          </label>
        </div>
        <article className="letter" aria-label="A letter from Fovea">
          <p>Dear founding member,</p>
          <p>Thank you for joining Fovea this early.{no && ` You are ${no}.`}</p>
          <p>We started Fovea because we wanted to talk to our agents the way we would talk to someone beside us: point at the thing, say what we mean, and get back to work. You are helping us find out how far that goes.</p>
          <p>Your price stays where it is for as long as you are with us. When eye tracking is ready, it comes to you first, and so will the first chance to reserve a Fovea Bar.</p>
          <p>If something feels wrong, or right, write back to the email this came with. It comes to us.</p>
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

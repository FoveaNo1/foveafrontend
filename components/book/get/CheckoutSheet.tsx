"use client";

import { useEffect, useRef, useState } from "react";
import { CHECKOUT_MODE, Prices, type Cycle } from "../../../lib/landing/book";

// The checkout: a sheet from the right on a desktop, a drawer from the bottom on a phone (Vaul's curve and numbers:
// 500 ms; drag past a quarter of its height, or flick faster than 0.4 px/ms, to close). Apple Pay and Link first,
// then three fields (Baymard; research/rewards.md). Paying is a ledger line, not a button.
// CHECKOUT_MODE "demo" (as asked) charges nothing and goes straight to the welcome; "stripe" goes to /checkout.

type Props = { open: boolean; cycle: Cycle; onClose: () => void; onPaid: () => void };

export default function CheckoutSheet({ open, cycle, onClose, onPaid }: Props) {
  const sheet = useRef<HTMLElement>(null);
  const grab = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const timers = useRef<number[]>([]);
  const [pay, setPay] = useState<"idle" | "processing" | "paid">("idle");
  const P = Prices[cycle];

  // open: keep the page still behind it, move focus in, close on Escape; closing gives focus back
  useEffect(() => {
    const el = sheet.current; if (!el) return;
    if (!open) return;
    lastFocus.current = document.activeElement;
    el.style.removeProperty("--drag");
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => el.focus({ preventScroll: true }), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      const f = lastFocus.current as HTMLElement | null;
      if (f && f.isConnected) f.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // on a phone: drag the handle down to close
  useEffect(() => {
    const el = sheet.current, g = grab.current; if (!el || !g) return;
    let y0 = 0, t0 = 0, dy = 0, dragging = false;
    const down = (e: PointerEvent) => { if (!e.isPrimary) return; dragging = true; y0 = e.clientY; t0 = performance.now(); dy = 0; el.classList.add("dragging"); g.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!dragging) return; const raw = e.clientY - y0; dy = raw >= 0 ? raw : Math.max(-24, -8 * Math.log(-raw + 1)); el.style.setProperty("--drag", dy + "px"); };
    const end = () => {
      if (!dragging) return; dragging = false; el.classList.remove("dragging");
      const v = Math.max(0, dy) / Math.max(1, performance.now() - t0);
      if (dy > el.offsetHeight * 0.25 || v > 0.4) onClose(); else el.style.setProperty("--drag", "0px");
    };
    g.addEventListener("pointerdown", down); g.addEventListener("pointermove", move);
    g.addEventListener("pointerup", end); g.addEventListener("pointercancel", end);
    return () => { g.removeEventListener("pointerdown", down); g.removeEventListener("pointermove", move); g.removeEventListener("pointerup", end); g.removeEventListener("pointercancel", end); };
  }, [onClose]);

  const payNow = () => {
    if (pay !== "idle") return;
    if (CHECKOUT_MODE === "stripe") { location.href = `/checkout?cycle=${cycle}`; return; }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPay("processing");
    timers.current.push(window.setTimeout(() => setPay("paid"), reduce ? 300 : 1400));
    timers.current.push(window.setTimeout(() => { onClose(); onPaid(); }, reduce ? 600 : 2000));
    timers.current.push(window.setTimeout(() => setPay("idle"), reduce ? 900 : 2600));
  };

  return (
    <>
      <div className={`scrim${open ? " open" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside ref={sheet} className={`sheet${open ? " open" : ""}`} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="sheet-title" aria-hidden={!open} inert={!open}>
        <div ref={grab} className="grab" aria-hidden="true" />
        <form className="sheet-in" id="pay-form" noValidate onSubmit={(e) => { e.preventDefault(); payNow(); }}>
          <div className="sheet-head">
            <div><h2 id="sheet-title">Fovea Pro</h2><p>Founding member · {P.name}</p></div>
            <button className="x" type="button" onClick={onClose} aria-label="Close">×</button>
          </div>
          <div className="sum">
            <div><span>{P.line}</span><span>{P.total}</span></div>
            <div className="total"><span>Total today</span><span>{P.total}<small>USD</small></span></div>
            <p>Your founding price is kept for as long as your membership is active. Your founding number is given in the order you join.</p>
          </div>
          <div className="express">
            <button className="apple" type="button" onClick={payNow}> Pay</button>
            <button className="quiet-link" type="button" onClick={payNow}>Pay with Link</button>
          </div>
          <p className="or-line">or pay with card</p>
          <label className="f"><span>Email</span><input className="line" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" /></label>
          <div className="f"><span>Card</span>
            <div className="cardbox">
              <input inputMode="numeric" autoComplete="cc-number" aria-label="Card number" placeholder="1234 1234 1234 1234" />
              <div className="r2">
                <input inputMode="numeric" autoComplete="cc-exp" aria-label="Expiry" placeholder="MM / YY" />
                <input inputMode="numeric" autoComplete="cc-csc" aria-label="CVC" placeholder="CVC" />
              </div>
            </div>
          </div>
          <div className="row2">
            <label className="f"><span>Country</span>
              <select autoComplete="country" defaultValue="United States">
                <option>United States</option><option>United Kingdom</option><option>Canada</option><option>Germany</option><option>Japan</option>
              </select>
            </label>
            <label className="f"><span>Postcode</span><input className="line" autoComplete="postal-code" /></label>
          </div>
        </form>
        <div className="sheet-foot">
          <p className="then">{P.then}</p>
          <button className="pay-row" type="submit" form="pay-form" disabled={pay !== "idle"}>
            <span className="swap" key={pay}>
              {pay === "idle" && <><span>{P.pay}</span><span className="ar" aria-hidden="true">→</span></>}
              {pay === "processing" && <><span>Processing</span><span className="spin" aria-hidden="true" /></>}
              {pay === "paid" && <><span>Paid</span><span className="ar" aria-hidden="true">✓</span></>}
            </span>
          </button>
          <p className="fine">
            If Fovea isn’t for you, write to us within 14 days and we’ll refund you in full. Payments by Stripe.{" "}
            <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a>
          </p>
        </div>
      </aside>
    </>
  );
}

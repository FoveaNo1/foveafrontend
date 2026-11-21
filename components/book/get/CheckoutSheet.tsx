"use client";

import { useEffect, useRef, useState } from "react";
import { startCheckout } from "../../../lib/account";
import { Prices, type Cycle } from "../../../lib/landing/book";

// The checkout: a sheet from the right on a desktop, a drawer from the bottom on a phone (Vaul's curve and numbers:
// 500 ms; drag past a quarter of its height, or flick faster than 0.4 px/ms, to close). What Pro costs, then paying
// as a ledger line, not a button. Oct 21: paying is real. The line goes on to Stripe's own secure page (the backend
// makes the Checkout session, lib/account.ts startCheckout), or to signing in first; Stripe sends the payment back
// to /checkout/success, where the welcome opens once the backend says Pro is on. The card fields drawn here before
// (a design, never sent anywhere) are gone: the card is given to Stripe, on its page.

type Props = { open: boolean; cycle: Cycle; onClose: () => void };

export default function CheckoutSheet({ open, cycle, onClose }: Props) {
  const sheet = useRef<HTMLElement>(null);
  const grab = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const [pay, setPay] = useState<"idle" | "going">("idle");
  const [error, setError] = useState("");
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

  // coming back to the page from Stripe (the browser's Back), the sheet is ready again
  useEffect(() => {
    const show = (e: PageTransitionEvent) => { if (e.persisted) setPay("idle"); };
    addEventListener("pageshow", show);
    return () => removeEventListener("pageshow", show);
  }, []);

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

  const payNow = async () => {
    if (pay !== "idle") return;
    setPay("going");
    setError("");
    try {
      await startCheckout(cycle);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create checkout.");
      setPay("idle");
    }
  };

  return (
    <>
      <div className={`scrim${open ? " open" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside ref={sheet} className={`sheet${open ? " open" : ""}`} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="sheet-title" aria-hidden={!open} inert={!open}>
        <div ref={grab} className="grab" aria-hidden="true" />
        <div className="sheet-in">
          <div className="sheet-head">
            <div><h2 id="sheet-title">Fovea Pro</h2><p>Founding member · {P.name}</p></div>
            <button className="x" type="button" onClick={onClose} aria-label="Close">×</button>
          </div>
          <div className="sum">
            <div><span>{P.line}</span><span>{P.total}</span></div>
            <div className="total"><span>Total today</span><span>{P.total}<small>USD</small></span></div>
            <p>Your founding price is kept for as long as your membership is active.</p>
          </div>
          {/* what happens next, set as the download page's install steps are */}
          <ol className="sheet-steps" aria-label="What happens next">
            <li><i>a.</i>Sign in, or make your account, with your email, Google or Apple.</li>
            <li><i>b.</i>Pay on Stripe’s secure page.</li>
            <li><i>c.</i>Open Fovea on your Mac. Pro is on.</li>
          </ol>
        </div>
        <div className="sheet-foot">
          <p className="then">{P.then}</p>
          {error && <p className="sheet-error" role="alert">{error}</p>}
          <button className="pay-row" type="button" onClick={payNow} disabled={pay !== "idle"}>
            <span className="swap" key={pay}>
              {pay === "idle" && <><span>Continue to payment</span><span className="ar" aria-hidden="true">→</span></>}
              {pay === "going" && <><span>Opening secure checkout</span><span className="spin" aria-hidden="true" /></>}
            </span>
          </button>
          <p className="fine">
            You pay on Stripe’s secure page. If Fovea isn’t for you, write to us within 14 days and we’ll refund you in full.{" "}
            <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a>
          </p>
        </div>
      </aside>
    </>
  );
}

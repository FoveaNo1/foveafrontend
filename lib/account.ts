// Signing in and paying, for the pages in the landing page's type (Oct 21): the calls the earlier pages made
// (Sep 5: components/CheckoutPageContent.tsx and AccountPageContent.tsx, now in components/book/account), to the
// same places. Signing in is Supabase's (lib/supabase-browser.ts: a link by email, Google or Apple). Paying and the
// subscription are the Fovea backend's (lib/billing-client.ts; api.hellofovea.com, hellofovea/fovea-backend-legacy),
// which owns Stripe: it makes the Stripe Checkout session, has Stripe send people back to
// /checkout/success?session_id=… (or /checkout?canceled=1), and opens the Customer Portal, which returns to /account.

import type { Session } from "@supabase/supabase-js";
import { createBillingCheckout, createBillingPortal, type BillingCycle } from "./billing-client";
import { getSupabaseBrowserClient } from "./supabase-browser";

/** Where to go after signing in: a path on this site only, never another site's address. */
export function safeNext(next: string | null | undefined, fallback = "/account"): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}

/** The billing cycle a link asks for (yearly unless it says monthly). */
export const cycleOf = (v: string | null | undefined): BillingCycle => (v === "monthly" ? "monthly" : "yearly");

/** The sign-in page, coming back to `next` afterwards. */
export const signInHref = (next: string) => `/login?next=${encodeURIComponent(safeNext(next))}`;

/** The app's own link after paying (it checks the session itself). */
export const appHref = (sessionId?: string | null) =>
  "fovea://billing/success" + (sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "");

/** The signed-in session, or null when signed out. Throws when signing in isn't available (the site's Supabase
 *  settings are missing). */
export async function currentSession(): Promise<Session | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Signing in is unavailable just now. Please try again shortly.");
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

/** Pay for Pro. Signed in: the backend makes a Stripe Checkout session and the page goes to it. Signed out: sign in
 *  first, then on to /checkout with the same cycle. Says which way it went; throws if it couldn't go either way. */
export async function startCheckout(cycle: BillingCycle): Promise<"stripe" | "sign-in"> {
  const session = await currentSession();
  if (!session?.access_token) {
    location.href = signInHref(`/checkout?cycle=${cycle}`);
    return "sign-in";
  }
  location.assign(await createBillingCheckout(session.access_token, { billingCycle: cycle }));
  return "stripe";
}

/** Stripe's Customer Portal (change the card, cancel, invoices); it comes back to /account. */
export async function openBillingPortal(): Promise<"stripe" | "sign-in"> {
  const session = await currentSession();
  if (!session?.access_token) {
    location.href = signInHref("/account");
    return "sign-in";
  }
  location.assign(await createBillingPortal(session.access_token));
  return "stripe";
}

export async function signOut() {
  await getSupabaseBrowserClient()?.auth.signOut();
  location.href = "/";
}

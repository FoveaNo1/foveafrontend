import type { Metadata } from "next";
import CheckoutDone from "../../../../components/book/account/CheckoutDone";
import SiteFoot from "../../../../components/book/SiteFoot";
import TopBar from "../../../../components/book/TopBar";

export const metadata: Metadata = { title: "Checkout · Fovea", robots: { index: false, follow: false } };

// Stripe sends a payment back here with ?session_id=cs_… (the backend's STRIPE_SUCCESS_URL). Only a well-formed
// Checkout session id is passed on; the page then asks the backend about it.
export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string | string[] }> }) {
  const raw = (await searchParams).session_id;
  const sessionId = typeof raw === "string" && /^cs_(live|test)_[A-Za-z0-9_]+$/.test(raw) && raw.length <= 255 ? raw : null;
  return (
    <>
      <TopBar />
      <CheckoutDone sessionId={sessionId} />
      <SiteFoot />
    </>
  );
}

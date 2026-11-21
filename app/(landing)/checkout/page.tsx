import type { Metadata } from "next";
import Checkout from "../../../components/book/account/Checkout";
import SiteFoot from "../../../components/book/SiteFoot";
import TopBar from "../../../components/book/TopBar";
import { cycleOf } from "../../../lib/account";

export const metadata: Metadata = {
  title: "Checkout · Fovea",
  description: "Choose your billing cycle for Fovea Pro.",
  robots: { index: false, follow: false },
};

// Stripe sends a canceled payment back here with ?canceled=1 (the backend's STRIPE_CANCEL_URL).
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ canceled?: string; cycle?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <TopBar />
      <Checkout initialCycle={cycleOf(params.cycle)} canceled={params.canceled === "1"} />
      <SiteFoot />
    </>
  );
}

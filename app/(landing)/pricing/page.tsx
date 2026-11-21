import type { Metadata } from "next";
import PricingBody from "../../../components/book/PricingBody";
import SiteFoot from "../../../components/book/SiteFoot";
import TopBar from "../../../components/book/TopBar";

// The plans, as on the download page, with everything side by side and the common questions.
export const metadata: Metadata = {
  title: "Pricing · Fovea",
  description: "Fovea is free to start. Pro is $9 a month for founding members, billed yearly, or $20 month to month.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <TopBar />
      <PricingBody />
      <SiteFoot />
    </>
  );
}

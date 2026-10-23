import type { Metadata } from "next";
import Account from "../../../components/book/account/Account";
import SiteFoot from "../../../components/book/SiteFoot";
import TopBar from "../../../components/book/TopBar";

export const metadata: Metadata = {
  title: "Account · Fovea",
  description: "Your Fovea plan, usage and billing.",
  robots: { index: false, follow: false },
};

// Stripe's Customer Portal comes back here (the backend's STRIPE_PORTAL_RETURN_URL).
export default function AccountPage() {
  return (
    <>
      <TopBar />
      <Account />
      <SiteFoot />
    </>
  );
}

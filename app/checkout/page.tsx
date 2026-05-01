import type { Metadata } from "next";
import CheckoutPageContent from "../../components/CheckoutPageContent";

export const metadata: Metadata = {
  title: "Checkout — Fovea",
  description: "Choose your billing cycle for Fovea Pro.",
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}

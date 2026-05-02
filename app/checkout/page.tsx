import type { Metadata } from "next";
import CheckoutPageContent from "../../components/CheckoutPageContent";
import type { BillingCycle } from "../../lib/billing-client";

export const metadata: Metadata = {
  title: "Checkout — Fovea",
  description: "Choose your billing cycle for Fovea Pro.",
};

type CheckoutPageProps = {
  searchParams: Promise<{
    canceled?: string;
    cycle?: string;
  }>;
};

const cancelNotice =
  "Payment was canceled. You can choose a billing cycle and continue whenever you're ready.";

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const initialCycle: BillingCycle = params.cycle === "monthly" ? "monthly" : "yearly";
  const initialNotice = params.canceled === "1" ? cancelNotice : null;

  return (
    <CheckoutPageContent initialCycle={initialCycle} initialNotice={initialNotice} />
  );
}

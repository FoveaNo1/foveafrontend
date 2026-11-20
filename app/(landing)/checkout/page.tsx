import { redirect } from "next/navigation";

// Nov 8 (Yulun: "remove pricing, we will go with free trial"): nothing to buy. An old link to /checkout (and Stripe's
// canceled payment, ?canceled=1) goes to the download, the free trial. /checkout/success stays, for a payment already
// made.
export default function CheckoutPage() {
  redirect("/download");
}

import { redirect } from "next/navigation";

// Nov 8 (Yulun: "remove pricing, we will go with free trial"): no plans to show. An old link to /pricing goes to the
// download, the free trial.
export default function PricingPage() {
  redirect("/download");
}

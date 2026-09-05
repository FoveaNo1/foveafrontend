import type { BillingStatus } from "./billing-client";

export function billingUsage(status: BillingStatus | null) {
  if (!status) return { summary: "Unavailable", detail: "", percent: null };
  if (status.is_pro) return { summary: "Unlimited", detail: "Included in your Pro access", percent: null };
  if (!Number.isFinite(status.limit) || status.limit <= 0 || !Number.isFinite(status.used)) {
    return { summary: "Unavailable", detail: "", percent: null };
  }
  // Free quota is a weekly allowance, not a duration. Pro access is unlimited.
  const percent = Math.min(100, Math.max(0, (status.used / status.limit) * 100));
  const rounded = Math.round(percent);
  return { summary: `${rounded}% used`, detail: `${100 - rounded}% of weekly allowance remaining`, percent };
}

function dateLabel(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat("en", {
    day: "numeric", month: "short", year: "numeric",
  }).format(date);
}

// Rights and payment management are independent: a trial can buy Pro, and
// someone whose card failed still needs access to the billing portal.
export function billingPresentation(status: BillingStatus | null) {
  if (!status) return { plan: "Unavailable", description: "Subscription status is unavailable.", buy: false, manage: false, paymentFailed: false };
  const trial = status.manual_entitlement && status.manual_entitlement_reason === "new_user_trial";
  const paymentFailed = status.payment_action_required ?? status.status_kind === "payment_failed";
  const date = dateLabel(status.status_at || status.billing_period_end);
  const manualDate = dateLabel(status.manual_entitlement_end || status.status_at);
  let description: string;
  if (paymentFailed) description = "Payment needs attention. Update your payment method to continue your subscription.";
  else switch (status.status_kind) {
    case "renews": description = date ? `Renews on ${date}` : "Active subscription"; break;
    case "pro_until": description = date ? `Pro until ${date}` : "Pro remains active for this billing period"; break;
    case "manual_pro": description = trial
      ? (manualDate ? `Free trial until ${manualDate}. Subscribe to keep Pro after your trial.` : "Free trial. Subscribe to keep Pro.")
      : (manualDate ? `Pro access until ${manualDate}. No paid subscription required for this access.` : "Pro access provided to your account."); break;
    default: description = "Limited captures and basic features";
  }
  const fallbackBuy = status.status_kind === "free" || status.status_kind === "manual_pro";
  return {
    plan: trial ? "Pro trial" : status.is_pro ? "Pro" : "Free",
    description,
    buy: !paymentFailed && (status.checkout_available ?? fallbackBuy),
    manage: status.manage_billing_available,
    paymentFailed,
  };
}

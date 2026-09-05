export type BillingCycle = "yearly" | "monthly";

type CheckoutPayload = {
  billingCycle: BillingCycle;
};

type ApiSuccess<T> = {
  data?: T;
};

type CheckoutResponse = {
  url?: string;
};

// BillingStatus mirrors the backend's BillingStatusResponse (see
// models/request.go on the Go side). The shape is the contract the Web
// account page consumes; mac uses the leaner /api/quota/check.
//
export type BillingStatus = {
  is_pro: boolean;
  remaining: number;
  used: number;
  limit: number;

  plan: "free" | "pro";
  status_kind: "free" | "renews" | "pro_until" | "payment_failed" | "manual_pro";
  status_at?: string;
  cancel_at_period_end: boolean;
  billing_period_end?: string;
  manage_billing_available: boolean;
  checkout_available?: boolean;
  payment_action_required?: boolean;
  manual_entitlement?: boolean;
  manual_entitlement_reason?: string;
  manual_entitlement_end?: string;
};

export function getBackendBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_FOVEA_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:8080"
  ).replace(/\/$/, "");
}

export async function createBillingCheckout(
  accessToken: string,
  payload: CheckoutPayload,
) {
  const response = await fetch(`${getBackendBaseUrl()}/api/billing/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = (await response.json().catch(() => null)) as
    | (ApiSuccess<CheckoutResponse> & CheckoutResponse & { error?: string; message?: string })
    | null;

  if (!response.ok) {
    const message = json?.error || json?.message || "Failed to create checkout.";
    throw new Error(message);
  }

  const url = json?.data?.url || json?.url;
  if (!url) {
    throw new Error("Checkout URL was missing from the billing response.");
  }

  return url;
}

export async function createBillingPortal(accessToken: string) {
  const response = await fetch(`${getBackendBaseUrl()}/api/billing/portal`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const json = (await response.json().catch(() => null)) as
    | (ApiSuccess<CheckoutResponse> & CheckoutResponse & { error?: string; message?: string })
    | null;

  if (!response.ok) {
    const message = json?.error || json?.message || "Failed to open billing portal.";
    throw new Error(message);
  }

  const url = json?.data?.url || json?.url;
  if (!url) {
    throw new Error("Portal URL was missing from the billing response.");
  }

  return url;
}

export async function getBillingStatus(accessToken: string): Promise<BillingStatus> {
  const response = await fetch(`${getBackendBaseUrl()}/api/billing/status`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const json = (await response.json().catch(() => null)) as
    | (ApiSuccess<BillingStatus> & BillingStatus & { error?: string; message?: string })
    | null;

  if (!response.ok) {
    const message = json?.error || json?.message || "Failed to load subscription status.";
    throw new Error(message);
  }

  // Backend wraps responses in {code, data}; older bare-payload responses are
  // not produced by /api/billing/status, but we tolerate both shapes for
  // resilience to envelope drift.
  const status = (json?.data ?? json) as BillingStatus | null;
  if (!status || typeof status.plan !== "string") {
    throw new Error("Billing status was missing from the backend response.");
  }

  return status;
}

export type CheckoutStatus = {
  state: "open" | "expired" | "processing" | "syncing" | "active" | "inactive";
  payment_confirmed: boolean;
  entitlement_active: boolean;
};

export async function getCheckoutStatus(accessToken: string, sessionId: string, signal?: AbortSignal): Promise<CheckoutStatus> {
  const response = await fetch(`${getBackendBaseUrl()}/api/billing/checkout/status?session_id=${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store", signal,
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) throw new Error(json?.message || "Unable to verify this checkout. Please try again.");
  const status = json?.data as CheckoutStatus | undefined;
  if (!status || !["open", "expired", "processing", "syncing", "active", "inactive"].includes(status.state)) {
    throw new Error("Unable to verify this checkout. Please try again.");
  }
  return status;
}

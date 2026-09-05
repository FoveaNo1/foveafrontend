import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Exercise the same presentation function used by the account component.
// Type checking is a separate tsc gate; this runner needs no browser credentials.
const source = readFileSync(new URL("../lib/billing-presentation.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exports = {};
vm.runInNewContext(outputText, { exports, Date, Intl });
const present = exports.billingPresentation;
const free = { is_pro: false, plan: "free", status_kind: "free", manage_billing_available: false };

test("free account can purchase", () => {
  const view = present(free);
  assert.equal(view.buy, true); assert.equal(view.manage, false); assert.equal(view.plan, "Free");
});
test("trial can convert to paid without a Stripe customer", () => {
  const view = present({ ...free, is_pro: true, plan: "pro", status_kind: "manual_pro", manual_entitlement: true, manual_entitlement_reason: "new_user_trial", manual_entitlement_end: "2026-10-01T00:00:00Z" });
  assert.equal(view.buy, true); assert.equal(view.manage, false); assert.equal(view.plan, "Pro trial");
  assert.match(view.description, /Free trial until/);
});
test("abandoned checkout does not hide trial purchase", () => {
  const view = present({ ...free, is_pro: true, status_kind: "manual_pro", manage_billing_available: true, checkout_available: true });
  assert.equal(view.buy, true); assert.equal(view.manage, true);
});
test("paid and cancel-at-period-end accounts manage their existing subscription", () => {
  for (const status_kind of ["renews", "pro_until"]) {
    const view = present({ ...free, is_pro: true, status_kind, manage_billing_available: true, checkout_available: false });
    assert.equal(view.buy, false); assert.equal(view.manage, true);
  }
});
test("failed payment leads to card recovery even while trial access continues", () => {
  for (const status_kind of ["payment_failed", "manual_pro"]) {
    const view = present({ ...free, status_kind, manage_billing_available: true, payment_action_required: true, checkout_available: false });
    assert.equal(view.buy, false); assert.equal(view.manage, true); assert.equal(view.paymentFailed, true);
    assert.match(view.description, /Update your payment method/);
  }
});
test("expired subscription can buy again and still see invoice history", () => {
  const view = present({ ...free, manage_billing_available: true, checkout_available: true });
  assert.equal(view.buy, true); assert.equal(view.manage, true);
});
test("a failed status read does not masquerade as Free or invite another purchase", () => {
  const view = present(null);
  assert.equal(view.plan, "Unavailable"); assert.equal(view.buy, false); assert.equal(view.manage, false);
});

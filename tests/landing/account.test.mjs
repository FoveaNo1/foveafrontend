import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadTs } from "./load-ts.mjs";

// Signing in and paying (lib/account.ts, Oct 21): where a sign-in may send someone afterwards, which
// cycle a link asks for, and what the pages tell the backend and the app. The calls themselves are the backend's
// (api.hellofovea.com); these are the parts the site decides.
const { safeNext, cycleOf, signInHref, appHref } = loadTs("lib/account.ts");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(path.join(root, p), "utf8");

test("after signing in, only a path on this site: never another site's address", () => {
  assert.equal(safeNext("/checkout?cycle=monthly"), "/checkout?cycle=monthly");
  assert.equal(safeNext("/account"), "/account");
  for (const bad of ["//evil.example", "https://evil.example", "/\\evil.example", "evil", "", null, undefined]) {
    assert.equal(safeNext(bad), "/account", String(bad));
  }
  assert.equal(signInHref("/checkout?cycle=yearly"), "/login?next=%2Fcheckout%3Fcycle%3Dyearly");
  assert.equal(signInHref("//evil.example"), "/login?next=%2Faccount");
});

test("a link asks for yearly unless it says monthly", () => {
  assert.equal(cycleOf("monthly"), "monthly");
  for (const v of ["yearly", "MONTHLY", "weekly", "", null, undefined]) assert.equal(cycleOf(v), "yearly", String(v));
});

test("the app hears of a payment with its Checkout session", () => {
  assert.equal(appHref("cs_live_a1B2"), "fovea://billing/success?session_id=cs_live_a1B2");
  assert.equal(appHref(null), "fovea://billing/success");
});

test("the checkout is real: no card fields drawn by the site, and paying goes through the backend", () => {
  const sheet = read("components/book/get/CheckoutSheet.tsx");
  assert.ok(!/cc-number|cc-csc|cc-exp/.test(sheet), "the sheet draws card fields");
  assert.match(sheet, /startCheckout\(cycle\)/);
  assert.ok(!/CHECKOUT_MODE/.test(read("lib/landing/book.ts")), "a demo mode is still there");
  // the earlier pages' addresses, which the backend sends Stripe back to, still exist
  for (const p of ["checkout/page.tsx", "checkout/success/page.tsx", "account/page.tsx", "login/page.tsx", "auth/callback/page.tsx"]) {
    assert.ok(read(`app/(landing)/${p}`).length > 0, p);
  }
});

test("no made-up numbers on a real page: places left, or a founding number outside the preview", () => {
  assert.ok(!/places left/.test(read("components/book/get/Plans.tsx").replace(/\{\/\*[\s\S]*?\*\/\}/g, "")), "a places-left count is shown");
  const welcome = read("components/book/get/Welcome.tsx");
  assert.match(welcome, /const no = demo \?/, "the founding number isn't kept to the preview");
});

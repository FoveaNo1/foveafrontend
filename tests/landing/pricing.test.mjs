import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs, readProjectFile } from "./load-ts.mjs";

test("/pricing renders the pricing body instead of redirecting to download", () => {
  const page = readProjectFile("app/(landing)/pricing/page.tsx");
  assert.match(page, /<PricingBody\s*\/>/);
  assert.doesNotMatch(page, /redirect\(/);
});

test("the displayed Pro prices are $12 monthly and $99 yearly", () => {
  const { Prices } = loadTs("lib/landing/book.ts");
  const plans = readProjectFile("components/book/get/Plans.tsx");
  const pricingBody = readProjectFile("components/book/PricingBody.tsx");
  assert.equal(Prices.monthly.total, "$12");
  assert.equal(Prices.yearly.total, "$99");
  const minor = (total) => Math.round(Number(total.slice(1)) * 100);
  assert.equal(minor(Prices.monthly.total), 1200);
  assert.equal(minor(Prices.yearly.total), 9900);
  assert.equal(Prices.yearly.line, "$8.25 × 12 months");
  assert.match(plans, /\$99\/year/);
  assert.match(plans, /\$8\.25\/month/);
  assert.match(plans, /\$12\/month/);
  assert.match(plans, /Join yearly, \$99/);
  assert.match(plans, /Join monthly, \$12/);
  assert.match(pricingBody, /\$12\/month, or \$99\/year \(\$8\.25\/month\)/);
});

test("the hero and pricing page show the 14-day Pro trial", () => {
  assert.match(readProjectFile("components/book/heroes/shared.tsx"), /14-day free trial/);
  assert.match(readProjectFile("components/book/get/Plans.tsx"), /Every new account starts with 14 days of Pro, no card required/);
});

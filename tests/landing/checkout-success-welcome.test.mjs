import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadTs, readProjectFile } from "./load-ts.mjs";

test("/checkout/success renders the Pro welcome without old founding promises", () => {
  assert.match(readProjectFile("app/(landing)/checkout/success/page.tsx"), /<CheckoutDone sessionId=\{sessionId\}/);
  const CheckoutDone = loadTs("components/book/account/CheckoutDone.tsx").default;
  const html = renderToStaticMarkup(createElement(CheckoutDone, { sessionId: "cs_test_probe" }));
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  assert.match(text, /Welcome to Fovea/);
  assert.match(text, /Pro is on\. Open Fovea on your Mac and it is already there/);
  for (const oldPromise of [/founding/i, /Fovea Bar/i, /price is kept/i, /Your name, for your card/i]) {
    assert.doesNotMatch(text, oldPromise);
  }
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

// Coming back to the landing page (lib/landing/place.ts, Oct 20, Yulun): it opens where the reader left it when they
// come back from another page (a link home, or Back), and at the top on a fresh visit or a reload.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const source = ts.transpileModule(readFileSync(path.join(root, "lib/landing/place.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

/** A tab: its storage, its address, how its document was opened, and its clock. */
function tab({ nav = "navigate", hash = "", stored = {} } = {}) {
  const items = new Map(Object.entries(stored));
  const clock = { now: 1_000_000 };
  const ctx = {
    module: { exports: {} },
    window: {},
    sessionStorage: { getItem: (k) => items.get(k) ?? null, setItem: (k, v) => items.set(k, String(v)), removeItem: (k) => items.delete(k) },
    location: { hash, pathname: "/" },
    performance: { getEntriesByType: () => [{ type: nav }] },
    Date: { now: () => clock.now },
  };
  ctx.exports = ctx.module.exports;
  vm.runInNewContext(source, ctx);
  return { ...ctx.module.exports, clock };
}
/** A place, copied out of the tab (so it compares as a plain object). */
const plain = (p) => (p ? JSON.parse(JSON.stringify(p)) : p);
const LEFT = { y: 1250, hero: 7.2, film: { t: 5, state: "playing" } };
const leave = (t) => { Object.assign(t.here, LEFT); t.keep(); };

test("a fresh visit or a reload opens at the top, whatever was kept", () => {
  const fresh = tab();
  leave(fresh);
  assert.equal(fresh.returning(), null);
  const reload = tab({ nav: "reload", stored: { "fovea:place": JSON.stringify(LEFT) } });
  assert.equal(reload.returning(), null);
});

test("a link home or Back says it is a return: the page opens where it was left, until the return is made", () => {
  const t = tab();
  leave(t);
  t.comingBack();
  assert.deepEqual(plain(t.returning()), LEFT);
  assert.deepEqual(plain(t.returning()), LEFT, "asking again gives the same place");
  t.settle();
  assert.equal(t.returning(), null, "the next arrival is a fresh one");
});

test("a return said long ago (the landing page never opened) doesn't count", () => {
  const t = tab();
  leave(t);
  t.comingBack();
  t.clock.now += 11_000;
  assert.equal(t.returning(), null);
});

test("a document opened by Back or Forward is a return, once", () => {
  const t = tab({ nav: "back_forward", stored: { "fovea:place": JSON.stringify(LEFT) } });
  assert.deepEqual(plain(t.returning()), LEFT);
  t.settle();
  assert.equal(t.returning(), null);
});

test("a link to a place on the page goes there instead; nothing kept, or something broken, opens at the top", () => {
  const anchored = tab({ hash: "#download" });
  leave(anchored);
  anchored.comingBack();
  assert.equal(anchored.returning(), null);
  const none = tab();
  none.comingBack();
  assert.equal(none.returning(), null);
  const broken = tab({ stored: { "fovea:place": "{not json" } });
  broken.comingBack();
  assert.equal(broken.returning(), null);
});

import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { loadTs, readProjectFile } from "./load-ts.mjs";

const require = createRequire(import.meta.url);
const { InterestSchema } = loadTs("lib/interest-schema.ts");

test("an email for what's next is accepted, trimmed and lowercased", () => {
  const parsed = InterestSchema.safeParse({ email: "  Alex@Example.com ", interest: "next" });
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.email, "alex@example.com");
});

test("unknown interests and keys are refused", () => {
  assert.equal(InterestSchema.safeParse({ email: "a@b.co", interest: "pricing" }).success, false);
  assert.equal(InterestSchema.safeParse({ email: "a@b.co", interest: "next", agents: "x" }).success, false);
});

function loadPost({ upsertError = null, mx = true } = {}) {
  const writes = [];
  const { outputText } = ts.transpileModule(readProjectFile("app/api/interest/route.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  });
  const mod = { exports: {} };
  vm.runInNewContext(outputText, {
    module: mod,
    exports: mod.exports,
    process: { env: { NODE_ENV: "production", SUPABASE_URL: "https://test.invalid", SUPABASE_SERVICE_ROLE_KEY: "test" } },
    console: { error() {}, info() {} },
    require(specifier) {
      if (specifier === "node:dns") return { promises: { resolveMx: async () => (mx ? [{ exchange: "mx.test" }] : []) } };
      if (specifier === "@supabase/supabase-js")
        return {
          createClient: () => ({
            from: (table) => ({
              upsert: async (rows, options) => {
                writes.push({ table, rows, options });
                return { error: upsertError };
              },
            }),
          }),
        };
      if (specifier === "next/server") return { NextResponse: { json: (body, init) => ({ body, status: init.status }) } };
      if (specifier.endsWith("/interest-schema")) return loadTs("lib/interest-schema.ts");
      return require(specifier);
    },
  });
  return { post: mod.exports.POST, writes };
}

const request = (body) => ({ json: async () => body, headers: { get: () => null } });

test("a sign-up is upserted once per (email, interest), never as an error for a repeat", async () => {
  const { post, writes } = loadPost();
  const res = await post(request({ email: "alex@example.com", interest: "next", company: "" }));
  assert.equal(res.status, 200);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].table, "lead_interests");
  // (Built inside the sandbox, so compared field by field rather than by prototype.)
  assert.equal(writes[0].options.onConflict, "email,interest");
  assert.equal(writes[0].options.ignoreDuplicates, true);
  assert.equal(writes[0].rows[0].email, "alex@example.com");
});

test("a filled honeypot gets the same answer and writes nothing", async () => {
  const { post, writes } = loadPost();
  const res = await post(request({ email: "bot@example.com", interest: "next", company: "Acme" }));
  assert.equal(res.status, 200);
  assert.equal(writes.length, 0);
});

test("a domain with no mail server is refused before anything is written", async () => {
  const { post, writes } = loadPost({ mx: false });
  const res = await post(request({ email: "alex@nowhere.invalid", interest: "next" }));
  assert.equal(res.status, 400);
  assert.equal(writes.length, 0);
});

test("a database failure says so, without an exclamation mark", async () => {
  const { post } = loadPost({ upsertError: { code: "XX000", message: "boom" } });
  const res = await post(request({ email: "alex@example.com", interest: "next" }));
  assert.equal(res.status, 500);
  assert.doesNotMatch(res.body.error, /!/);
});

test("the migration keys lead_interests on (email, interest) with row-level security on", () => {
  const sql = readProjectFile("supabase/migrations/20261010000000_lead_interests.sql");
  assert.match(sql, /primary key \(email, interest\)/);
  assert.match(sql, /enable row level security/);
});

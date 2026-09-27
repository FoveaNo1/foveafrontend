import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);

function loadTs(relativePath) {
  const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  const exports = {};
  const sandboxRequire = (specifier) => {
    if (specifier === "./waitlist-options") return loadTs("../lib/waitlist-options.ts");
    if (specifier === "zod") return require("zod");
    return require(specifier);
  };
  vm.runInNewContext(outputText, { exports, require: sandboxRequire });
  return exports;
}

const { SubscribeSchema } = loadTs("../lib/subscribe-schema.ts");
const routeSource = readFileSync(new URL("../app/api/subscribe/route.ts", import.meta.url), "utf8");
const formSource = readFileSync(new URL("../public/script.js", import.meta.url), "utf8");
const htmlSource = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const sqlSource = readFileSync(
  new URL("../supabase/migrations/20260914000000_add_leads_agents.sql", import.meta.url),
  "utf8",
);

test("POST body { email } is accepted under .strict()", () => {
  const parsed = SubscribeSchema.safeParse({ email: "alex@example.com" });
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.email, "alex@example.com");
  assert.equal(parsed.data.agents, undefined);
});

test("POST body { email, agents } is accepted under .strict() (no unrecognized-key 400)", () => {
  const parsed = SubscribeSchema.safeParse({
    email: "alex@example.com",
    agents: "  Cursor, Codex; usually 3  ",
  });
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.agents, "Cursor, Codex; usually 3");
  assert.equal(parsed.data.role, undefined);
  assert.equal(parsed.data.tools, undefined);
  assert.equal(parsed.data.ai_frequency, undefined);
});

test("landing agents text is stored as agents, not tools / role / ai_frequency", () => {
  const parsed = SubscribeSchema.safeParse({
    email: "alex@example.com",
    agents: "VS Code / IDE",
  });
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.agents, "VS Code / IDE");
  assert.equal(parsed.data.tools, undefined);
  assert.equal(parsed.data.role, undefined);
  assert.equal(parsed.data.ai_frequency, undefined);
});

test("unknown keys still 400 via .strict()", () => {
  const parsed = SubscribeSchema.safeParse({
    email: "alex@example.com",
    founding: true,
  });
  assert.equal(parsed.success, false);
  assert.match(String(parsed.error.issues[0].message), /unrecognized key/i);
});

test("route insert writes agents onto leads.agents only", () => {
  assert.match(routeSource, /insert\(\[agents \? \{ \.\.\.lead, agents \} : lead\]\)/);
  assert.doesNotMatch(
    routeSource,
    /agents:\s*(role|tools|ai_frequency)|role:\s*agents|tools:\s*agents|ai_frequency:\s*agents/,
  );
});

test("landing form stays email + agents and posts /api/subscribe", () => {
  assert.match(htmlSource, /id="access-heading">Get Early Access/);
  assert.match(htmlSource, /name="email"/);
  assert.match(htmlSource, /name="agents"/);
  assert.doesNotMatch(htmlSource, /founding|use-case|use_case/i);
  assert.match(formSource, /fetch\('\/api\/subscribe'/);
  assert.match(formSource, /payload\.agents = agents/);
  assert.doesNotMatch(formSource, /createClient|supabase\.from\(['"]leads['"]\)/);
  assert.match(formSource, /Thanks\. We’ll be in touch\./);
});

test("repo SQL adds public.leads.agents", () => {
  assert.match(sqlSource, /alter table public\.leads add column if not exists agents text;/);
});

function loadPost(insertError = null) {
  const writes = [];
  const { outputText } = ts.transpileModule(routeSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    process: { env: { NODE_ENV: "production", SUPABASE_URL: "https://test.invalid", SUPABASE_SERVICE_ROLE_KEY: "test" } },
    console: { error() {}, info() {} },
    require(specifier) {
      if (specifier === "node:dns") return { promises: { resolveMx: async () => [{ exchange: "mx.test.invalid" }] } };
      if (specifier === "@supabase/supabase-js") return {
        createClient: () => ({ from: (table) => ({ insert: async (rows) => {
          writes.push({ table, rows });
          return { error: insertError };
        } }) }),
      };
      if (specifier === "next/server") return { NextResponse: { json: (body, init) => ({ body, status: init.status }) } };
      if (specifier.endsWith("/subscribe-schema")) return loadTs("../lib/subscribe-schema.ts");
      if (specifier.endsWith("/waitlist-options")) return loadTs("../lib/waitlist-options.ts");
      if (specifier.endsWith("/waitlist-profile-token")) return { isWaitlistProfileTokenConfigured: () => false };
      return require(specifier);
    },
  });
  return { post: exports.POST, writes };
}

const submission = () => ({
  json: async () => ({ email: "alex@example.com", agents: "Codex + Cursor, 3 sessions" }),
  headers: { get: () => null },
});

test("POST saves email and agents together before returning success", async () => {
  const { post, writes } = loadPost();
  assert.equal((await post(submission())).status, 200);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].table, "leads");
  assert.equal(writes[0].rows[0].email, "alex@example.com");
  assert.equal(writes[0].rows[0].agents, "Codex + Cursor, 3 sessions");
});

for (const code of ["PGRST204", "42703"]) {
  test(`missing agents column (${code}) fails without retrying an email-only insert`, async () => {
    const { post, writes } = loadPost({ code, message: "Could not find the 'agents' column" });
    assert.equal((await post(submission())).status, 500);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].rows[0].agents, "Codex + Cursor, 3 sessions");
  });
}

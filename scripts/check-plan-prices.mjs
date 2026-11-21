import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const sourcePath = fileURLToPath(new URL("../lib/landing/book.ts", import.meta.url));
const source = readFileSync(sourcePath, "utf8");
const { outputText } = ts.transpileModule(source, {
  fileName: sourcePath,
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { Prices } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

function toMinor(total, cycle) {
  const match = /^\$(\d+)(?:\.(\d{2}))?$/.exec(total);
  if (!match) throw new Error(`Invalid ${cycle} total in lib/landing/book.ts: ${total}`);
  return Number(match[1]) * 100 + Number(match[2] ?? 0);
}

const url = "https://api.hellofovea.com/api/billing/plans";
try {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  const body = await response.json();
  const pro = body?.data?.plans?.find((plan) => plan.id === "pro");
  if (!pro) throw new Error("Backend response has no Pro plan");

  let mismatch = false;
  for (const cycle of ["monthly", "yearly"]) {
    const matching = pro.prices?.filter((price) => price.billing_cycle === cycle && price.currency === "usd") ?? [];
    if (matching.length !== 1 || !Number.isInteger(matching[0].amount_minor)) {
      throw new Error(`Backend response needs exactly one USD Pro ${cycle} price`);
    }
    const local = toMinor(Prices[cycle].total, cycle);
    const backend = matching[0].amount_minor;
    const same = local === backend;
    console.log(`Pro ${cycle}: page ${Prices[cycle].total} (${local} minor); backend $${(backend / 100).toFixed(2)} (${backend} minor) — ${same ? "match" : "MISMATCH"}`);
    if (!same) mismatch = true;
  }
  if (mismatch) process.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}

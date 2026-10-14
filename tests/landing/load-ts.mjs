// Loads a TypeScript module for node:test the way tests/subscribe-schema.test.mjs does (transpiled
// to CommonJS by the project's own TypeScript, run in a sandbox), following its relative imports.

import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cache = new Map();

function resolve(from, specifier) {
  const base = path.resolve(path.dirname(from), specifier);
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
    if (existsSync(candidate) && candidate.match(/\.tsx?$/)) return candidate;
  }
  throw new Error(`Cannot resolve ${specifier} from ${from}`);
}

function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const source = readFileSync(file, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    fileName: file,
  });
  const mod = { exports: {} };
  cache.set(file, mod);
  const sandboxRequire = (specifier) =>
    specifier.startsWith(".") ? load(resolve(file, specifier)) : require(specifier);
  vm.runInNewContext(outputText, { module: mod, exports: mod.exports, require: sandboxRequire, console, Math, performance });
  return mod.exports;
}

/** Load `lib/...` (relative to the project root). */
export function loadTs(relativeToRoot) {
  return load(path.join(root, relativeToRoot));
}

export function readProjectFile(relativeToRoot) {
  return readFileSync(path.join(root, relativeToRoot), "utf8");
}

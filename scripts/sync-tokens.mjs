// Pulls the canonical W3C token exports from the Tashilcar docs repo into ./tokens.
// Figma → docs repo (design-system/tokens-source) stays the single source of truth;
// this just vendors a copy so the library build is self-contained.
//
// Usage: node scripts/sync-tokens.mjs [pathToDocsRepo]
// Defaults to ../Tashilcar relative to this repo, override with TASHILCAR_DOCS env var.
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

const docsRepo =
  process.argv[2] ||
  process.env.TASHILCAR_DOCS ||
  resolve(repoRoot, "..", "Tashilcar");

const srcDir = join(docsRepo, "design-system", "tokens-source");
const destDir = join(repoRoot, "tokens");

if (!existsSync(srcDir)) {
  console.error(
    `[sync-tokens] Source not found: ${srcDir}\n` +
      `Pass the docs repo path or set TASHILCAR_DOCS.`,
  );
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
const files = readdirSync(srcDir).filter((f) => f.endsWith(".json"));
for (const f of files) {
  cpSync(join(srcDir, f), join(destDir, f));
  console.log(`[sync-tokens] ${f}`);
}
console.log(`[sync-tokens] Synced ${files.length} file(s) → tokens/`);

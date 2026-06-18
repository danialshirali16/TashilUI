// Copy the hand-authored + generated stylesheet entry (global.css, reset, token CSS,
// product themes, and bundled fonts) into dist/styles so consumers can import
// `tashil-ui/styles/global.css`. Vite's library build only emits the per-component
// CSS modules (under dist/styles/components/), not these top-level stylesheets.
import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "src/styles");
const dest = resolve(root, "dist/styles");

await mkdir(dest, { recursive: true });
// Copy everything except the per-component CSS Vite already emitted under components/.
await cp(src, dest, {
  recursive: true,
  filter: (path) => !path.includes(`${src}/components`),
});

console.log("[copy-styles] copied src/styles → dist/styles (incl. fonts/)");

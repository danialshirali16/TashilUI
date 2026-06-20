# Build & environment gotchas

Non-obvious things about the token pipeline, fonts, icons, and the local toolchain. Read the
relevant entry when touching those areas; you don't need all of it for normal component work.

## Tokens

- **Token files are self-contained per product.** Each `2. Product Tokens.<P>.json` embeds its own
  `references.{primary,secondary,gray}` + `alpha.gray`; semantic tokens alias into them. The shared
  `1. References Color.json` only has `shades`/`alphas`. The compiler (`scripts/build-tokens.mjs`)
  resolves aliases per-file — don't try to cross-resolve.
- **Upstream token typo:** `--color-background-overlay-defualt` (used by `Modal`) comes straight
  from Figma. Keep using it until the export is fixed.
- **Dimensional tokens pending Figma sync.** The `Size`, `Border Width`, `Focus Ring`, and
  `Duration` groups in `tokens/4. Measurement.json` were added in-repo (marked
  `com.tashilui.pendingFigma: true`) because Figma doesn't export them yet. They produce
  `--size-*`, `--border-width-*`, `--focus-ring-*`, `--duration-*`. **Action for the design team:**
  create matching Figma variables, then re-export to replace these. Current de-facto values:
  controls 32/40/48, icons 16/20/24, border 1/2, ring 2/2, motion 120/600ms — confirm against
  Figma before treating as canonical.
- **Don't edit generated CSS.** `reference.css`, `measurement.css`, `typography.css`, `themes/*.css`
  are produced by `pnpm tokens` and are git-ignored. Change values in the token JSON (ultimately
  Figma) and regenerate.

## Fonts

Yekan Bakh (FaNum / Persian numerals) ships as woff2 in `src/styles/fonts/` — weights 500 (Medium),
700 (Bold), 900 (Heavy), declared in `fonts.css`. `pnpm build` copies `src/styles` → `dist/styles`
(incl. fonts) via `scripts/copy-styles.mjs`, since Vite's lib build only emits per-component CSS.

## Icons

Icons are **generated, not hand-written.** `pnpm icons` (run inside `pnpm build`) reads
`src/icons/svg/*.svg` and emits `src/icons/Icon<Name>.tsx` + `index.ts` (git-ignored). Edit art in
the SVGs, never the `.tsx`. The cleanup step only deletes `Icon*.tsx` + the barrel, so hand-written
files like `Icons.stories.tsx` are safe — keep that scoping if you touch the script. Icons are
`1em` + `currentColor`: size with `font-size`/`--size-icon-*`, color with the `color`/
`--color-icon-*` cascade. Subpath: `import { IconUser } from "tashil-ui/icons"`. Adding a new icon =
drop the SVG in `src/icons/svg/` and rebuild.

## Toolchain

**Workspace isolation:** a stray `~/pnpm-workspace.yaml` would otherwise make pnpm install into the
home dir. A local `.npmrc` (`ignore-workspace=true`) keeps installs in this repo — don't remove it.
Tools that run their own install (e.g. `storybook upgrade`, `pnpm dlx`) can bypass it and write to
`~/node_modules`; if a CLI resolves the wrong version, re-run `pnpm install --ignore-workspace` to
repair the local tree.

# AGENTS.md — working on TashilUI

Rules of the road for agents (and humans) building this library. Read this before
touching code. The milestone tracker lives in [ROADMAP.md](ROADMAP.md).

## What this project is

A from-scratch React component library implementing Tashilcar's **Swiss Army** design
system. Deliberately built **without Tailwind, MUI, or shadcn/ui**.

- **Behavior/a11y:** Radix UI primitives — only for components that need it.
- **Styling:** 100% our own **CSS Modules + CSS custom properties**. Zero styling runtime.
- **Theming:** semantic design tokens, per-product themes via `[data-theme="..."]`.
- **Goals that drive every decision:** **fast loading** and **small files shipped to the
  browser**. Prefer pure-CSS components; pull Radix in per-component (tree-shakeable) only
  when accessibility/interaction demands it.

**Source of truth for design** lives in the docs repo
`../Tashilcar/design-system/` (sibling checkout):
- `tokens-source/*.json` — the W3C/Figma token exports (vendored into `tokens/`).
- `components/*.md` — the 33 component specs (variants, anatomy, tokens used, RTL notes).
- `foundations.md`, `tokens*.md` — RTL/Persian/Jalali/Yekan Bakh + token architecture.

## Rules every agent MUST follow

1. **Semantic tokens only — never hardcode.** No hex, rgb, raw px, ms, or font sizes in
   `*.module.css`. Use `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`,
   `var(--font-size-*)`, `var(--line-height-*)`, `var(--font-weight-*)`, plus the dimensional
   families: `var(--size-control-{sm,md,lg})` (control heights), `var(--size-control-min-{sm,md,lg})`
   (min widths), `var(--size-icon-{sm,md,lg})`, `var(--border-width-{default,thick})`,
   `var(--focus-ring-{width,offset})`, `var(--duration-{fast,slow})`. Use **semantic**
   color tokens (`--color-background-primary-default`), never primitives (`--ref-shades-*`)
   directly in components.
2. **Logical CSS properties only.** `margin-inline-start`, `padding-inline-end`,
   `inset-inline-*`, `text-align: start`. Never `left`/`right`/`margin-left`. The library
   ships direction-agnostic; RTL is the default (`reset.css` sets `direction: rtl`).
3. **Persian by default.** User-facing numbers use `toPersianDigits`; amounts use
   `formatRial` (`src/lib/persian.ts`). Built-in labels are Persian (e.g. Modal close = «بستن»).
4. **Don't edit generated CSS.** `reference.css`, `measurement.css`, `typography.css`,
   `themes/*.css` are produced by `pnpm tokens`. To change values, edit the token JSON
   (ultimately Figma) and regenerate. They are git-ignored.
5. **Reach for Radix only when needed.** Pure CSS for non-interactive/simple controls
   (Button, TextField, Chips…). Radix for focus-trap/keyboard/ARIA-heavy ones (Dialog,
   DropdownMenu, Popover, Tooltip, Tabs, Checkbox, RadioGroup, Switch, Progress).
6. **Every component ships:** `Component.tsx`, `Component.module.css`, `index.ts`,
   `Component.stories.tsx`. Add the export to `src/index.ts`. Stories must cover all states
   in **both `dir=rtl` and `ltr`** and across the **three product themes** (Storybook
   toolbar). Run the a11y addon. **Interactive components get `play`-function interaction
   tests** (per the Storybook MCP's `get-storybook-story-instructions`): import `fn`,
   `userEvent`, `expect` from `storybook/test` (not `@storybook/test`); use the `canvas`
   play arg directly (never `within(canvas)`); spy callbacks with `fn()` in `meta.args`.
   See `Button.stories.tsx` (the `Test:` stories).
7. **Verify before done:** `pnpm tokens && pnpm typecheck && pnpm build && pnpm lint:css`
   all green; component renders correctly in Storybook across themes + directions.

## The 6-step component build pattern

1. Read the spec doc in `../Tashilcar/design-system/components/<name>.md` (variants,
   anatomy, **Tokens used**, RTL notes) — and grep `src/styles/themes/*.css` for the exact
   token names available.
2. Choose pure-CSS vs a Radix primitive (see the table in [ROADMAP.md](ROADMAP.md)).
3. Build `.module.css` with semantic tokens + logical props; map Radix `[data-state]` /
   `[data-disabled]` attributes to styles.
4. Type the props to the documented variant axes (size / state / content / width).
5. Write stories for every state × theme × direction.
6. Add a `code-connect/<Component>.figma.ts` mapping keyed by the doc's `figma_key`, and
   mirror it back into `../Tashilcar/design-system/code-connect/` (update its `_index.md`).

## Button API (matches Figma Swiss Army)

`<Button>` has four axes mirroring the Figma component set:
- `intent`: `primary | secondary | neutral | success | error` (the Figma component name)
- `variant` (Figma "Style"): `solid | tonal | outline | ghost | link`
- `size`: `sm` (32px) | `md` (40px) | `lg` (48px) — Body type scale, weight 500, radius 4/6/8
- `iconOnly` (square 32/40/48), plus `leadingIcon` / `trailingIcon`, `loading`, `fill`, `disabled`

Colors are wired with per-(variant,intent) custom properties (`--tu-bg`, `--tu-fg`,
`--tu-bg-hover`, …) so base rules stay DRY — follow this pattern for new components with
many style/intent combinations. Verified pixel-level against Figma via Storybook.

## Known gotchas

- **Token files are self-contained per product.** Each `2. Product Tokens.<P>.json` embeds
  its own `references.{primary,secondary,gray}` + `alpha.gray`; semantic tokens alias into
  them. The shared `1. References Color.json` only has `shades`/`alphas`. The compiler
  (`scripts/build-tokens.mjs`) resolves aliases per-file — don't try to cross-resolve.
- **Upstream token typo:** `--color-background-overlay-defualt` (used by `Modal`) comes
  straight from Figma. Keep using it until the export is fixed.
- **Dimensional tokens pending Figma sync.** The `Size`, `Border Width`, `Focus Ring`, and
  `Duration` groups in `tokens/4. Measurement.json` were added in-repo (marked
  `com.tashilui.pendingFigma: true`) because Figma doesn't export them yet. They produce
  `--size-*`, `--border-width-*`, `--focus-ring-*`, `--duration-*`. **Action for the design
  team:** create matching Figma variables, then re-export to replace these. Values are the
  current de-facto ones (controls 32/40/48, icons 16/20/24, border 1/2, ring 2/2, motion
  120/600ms) — confirm against Figma before treating as canonical.
- **Fonts are bundled.** Yekan Bakh (FaNum / Persian numerals) ships as woff2 in
  `src/styles/fonts/` — weights 500 (Medium), 700 (Bold), 900 (Heavy), declared in
  `fonts.css`. `pnpm build` copies `src/styles` → `dist/styles` (incl. fonts) via
  `scripts/copy-styles.mjs`, since Vite's lib build only emits the per-component CSS.
- `Tooltip` requires a `<TooltipProvider>` ancestor (already in the Storybook preview).
- **Workspace isolation:** a stray `~/pnpm-workspace.yaml` would otherwise make pnpm
  install into the home dir. A local `.npmrc` (`ignore-workspace=true`) keeps installs in
  this repo — don't remove it. Tools that run their own install (e.g. `storybook upgrade`,
  `pnpm dlx`) can bypass it and write to `~/node_modules`; if a CLI resolves the wrong
  version, re-run `pnpm install --ignore-workspace` to repair the local tree.
- **Storybook is v10.** MDX doc blocks import from `@storybook/addon-docs/blocks` (not the
  removed `@storybook/blocks`); essentials' viewport/controls/interactions/actions are now
  built into core (addons list is just `addon-a11y`, `addon-docs`, `addon-mcp`).
- **Storybook reuses `vite.config.ts`**, which is tuned for the *library* build
  (externalizes React, `preserveModules`, `dts`). `.storybook/main.ts` has a `viteFinal`
  that strips those — keep it, or SB fails to resolve `@storybook/react/...entry-preview`.
  `@storybook/react` is also a direct devDependency (pnpm won't resolve it transitively).
- **Icons are generated, not hand-written.** `pnpm icons` (run inside `pnpm build`) reads
  `src/icons/svg/*.svg` and emits `src/icons/Icon<Name>.tsx` + `index.ts` (git-ignored).
  Edit art in the SVGs, never the `.tsx`. The cleanup step only deletes `Icon*.tsx` + the
  barrel, so hand-written files like `Icons.stories.tsx` are safe — keep that scoping if you
  touch the script. Icons are `1em` + `currentColor`: size with `font-size`/`--size-icon-*`,
  color with the `color`/`--color-icon-*` cascade. Subpath: `import { IconUser } from
  "tashil-ui/icons"`. Adding a new icon = drop the SVG in `src/icons/svg/` and rebuild.

## Storybook MCP (for AI agents)

Storybook **10** runs the official `@storybook/addon-mcp`, serving an MCP endpoint at
`http://localhost:6006/mcp` whenever `pnpm storybook` is up. The project `.mcp.json`
registers it as `storybook-mcp` (http transport), so Claude Code auto-connects when both
are running (approve the project server once). Tools: `list-all-documentation`,
`get-documentation`, `get-documentation-for-story`, `get-storybook-story-instructions`,
`preview-stories`. **Before writing/editing components or stories, call
`get-storybook-story-instructions`** for the framework-correct import/story patterns, and
`preview-stories` after, surfacing the returned preview URLs.

## Commands

```bash
pnpm install                          # deps (see workspace note below)
pnpm tokens                           # regenerate token CSS from tokens/*.json
pnpm icons                            # regenerate icon components from src/icons/svg/*.svg
pnpm storybook                        # dev Storybook on :6006
pnpm typecheck                        # tsc --noEmit
pnpm build                            # vite library build (ESM + types)
pnpm lint:css                         # stylelint — blocks hex + physical props
CI=1 pnpm build-storybook             # headless SB build (CI=1 skips the telemetry prompt)
pnpm test-storybook                   # run every story as a headless component test (Vitest + Playwright)
```

**Component tests:** `@storybook/addon-vitest` runs all stories headless via Vitest browser
mode (`vitest.config.ts`, kept separate from the lib `vite.config.ts`). `play`-function
interaction tests assert behavior; other stories get a smoke-render. Playwright's CDN is
geo-blocked here, so `vitest.config.ts` points at a locally-cached Chromium — override with
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, or run `pnpm exec playwright install chromium` from an
unblocked network. In a real browser, `userEvent.click` throws on `pointer-events: none`
elements — pass `{ pointerEventsCheck: 0 }` to test that disabled/loading controls stay inert.

Per-component acceptance: renders in all 3 themes and RTL+LTR; axe a11y passes;
keyboard/screen-reader works for Radix-backed ones; no hardcoded values (lint gate).

# TashilUI

A from-scratch React component library implementing Tashilcar's **Swiss Army** design system —
Radix UI primitives (behavior/a11y, only where needed) + 100% our own CSS Modules + CSS custom
properties. **No Tailwind, MUI, or shadcn/ui.** Goals that drive every decision: fast loading and
small files shipped to the browser.

**TashilUI is the design-token source of truth.** Tokens are authored here in `tokens/*.json`
(W3C/DTCG) and flow OUT to the docs repo — never the reverse. `pnpm sync-docs` copies `tokens/` →
`tashilcar-docs` and opens a review PR; a drift-check CI there fails if docs fall behind. Don't
pull tokens back from docs.

### Working without the docs repo (read this before touching the docs link)

The `tashilcar-docs` project is an **optional sibling checkout** (`../Tashilcar`), used only as a
design reference + token consumer. **This repo is fully self-contained without it.** If it's
absent — which is normal, e.g. you have no access to it — then:

- **Don't** recreate it, clone it, edit `scripts/sync-docs.mjs`, or change the token flow to
  work around its absence. `sync-docs` already fails safe (it just errors if the repo is missing).
- **Never reverse the token flow.** Tokens are authored here and flow one-way OUT. Do not pull,
  copy, or sync tokens *back* from docs, ever.
- Run `pnpm sync-docs` **only when the user explicitly asks** — never proactively.
- When a component spec doc (`../Tashilcar/design-system/components/<name>.md`) isn't reachable,
  just build from the **Figma link/screenshot** the user provides. The spec doc is a convenience,
  not a requirement — Figma is the ultimate source.

## Rules every change MUST follow

1. **Semantic tokens only — never hardcode.** No hex, rgb, raw px/ms, or font sizes in
   `*.module.css`. Use `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--font-*)`,
   `var(--size-*)`, `var(--border-width-*)`, `var(--focus-ring-*)`, `var(--duration-*)`. Use
   **semantic** color tokens, never primitives (`--ref-shades-*`) directly in components.
2. **Logical CSS properties only.** `margin-inline-start`, `inset-inline-*`, `text-align: start`.
   Never `left`/`right`/`margin-left`. RTL is the default.
3. **Persian by default.** Numbers via `toPersianDigits`; amounts via `formatRial`
   (`src/lib/persian.ts`). Built-in labels are Persian (e.g. Modal close = «بستن»).
4. **Don't edit generated CSS** (`reference.css`, `measurement.css`, `typography.css`,
   `themes/*.css`) — they're produced by `pnpm tokens` and git-ignored. Edit the token JSON.
5. **Reach for Radix only when needed.** Pure CSS for simple/non-interactive controls; Radix for
   focus-trap/keyboard/ARIA-heavy ones (Dialog, Popover, Tooltip, Checkbox, RadioGroup, Switch…).
6. **Every component ships** `.tsx` + `.module.css` + `index.ts` + `.stories.tsx` + `.mdx`,
   exported from `src/index.ts`. Stories cover every state × 3 themes × RTL/LTR; interactive ones
   get `play`-function tests (see [docs/storybook.md](docs/storybook.md)).
7. **Verify before done:** `pnpm tokens && pnpm typecheck && pnpm build && pnpm lint:css` all
   green, and it renders correctly in Storybook across themes + directions.

## Where to find more (load on demand)

- **Building a component?** Use the `/new-component` skill — it owns the full workflow (Figma
  review → stories → Overview MDX).
- **Implementation patterns** (field components, numeric/currency inputs, read-only a11y, Button
  variants): [docs/conventions.md](docs/conventions.md).
- **Stories & testing** (Storybook MCP, play tests, v10 specifics): [docs/storybook.md](docs/storybook.md).
- **Build/env gotchas** (token pipeline, fonts, icons, toolchain): [docs/gotchas.md](docs/gotchas.md).
- **What to build next** + Radix-per-component table: [ROADMAP.md](ROADMAP.md).

## Commands

```bash
pnpm install            # deps (see toolchain note in docs/gotchas.md)
pnpm tokens             # regenerate token CSS from tokens/*.json
pnpm sync-docs          # push token changes → tashilcar-docs as a review PR (gh)
pnpm icons              # regenerate icon components from src/icons/svg/*.svg
pnpm storybook          # dev Storybook on :6006 (also serves the Storybook MCP)
pnpm typecheck          # tsc --noEmit
pnpm build              # vite library build (ESM + types)
pnpm lint:css           # stylelint — blocks hex + physical props
pnpm test-storybook     # run every story as a headless component test
```

# TashilUI

The code implementation of Tashilcar's **Swiss Army** design system — React components
built on **Radix UI** primitives (behavior + accessibility) and styled with **100% our
own CSS Modules + CSS custom properties**. No Tailwind, no MUI, no shadcn.

Goals: **fast loading** and **small files in the browser** — zero styling runtime,
Radix imported per-component (tree-shakeable), tokens shipped as plain CSS variables.

## Token source of truth

Design tokens are exported from Figma (W3C DTCG JSON) and live in `tokens/`. They are the
single source of truth. The compiler in `scripts/build-tokens.mjs` turns them into CSS:

```
tokens/*.json  ──build-tokens──▶  src/styles/{reference,typography,measurement}.css
                                   src/styles/themes/{tashilpay,zamyad,zhina}.css
```

Regenerate (after `pnpm run sync-tokens` pulls fresh exports from the docs repo):

```sh
pnpm run tokens
```

Generated CSS is git-ignored and must never be hand-edited.

## Theming

Every component references only **semantic** custom properties (`--color-text-default`,
`--space-4`, …). Products differ only in what those semantics resolve to. Activate a
theme on a root element:

```html
<html dir="rtl" data-theme="zamyad">
```

`data-theme` ∈ `tashilpay | zamyad | zhina`. (Peykan has no tokens yet.)

## Develop

```sh
pnpm install
pnpm run tokens        # generate token CSS
pnpm run storybook     # explore components (RTL + theme switcher)
pnpm run build         # library build (ESM + types)
pnpm run lint:css      # forbids hex + physical (left/right) properties
pnpm run typecheck
```

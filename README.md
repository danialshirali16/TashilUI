# TashilUI

The code implementation of Tashilcar's **Swiss Army** design system — a from-scratch React component library built on **Radix UI** primitives (behavior + accessibility) and styled with **100% our own CSS Modules + CSS custom properties**. Deliberately built **without Tailwind, MUI, or shadcn/ui**.

**Philosophy:** Fast loading, small files shipped to the browser, zero styling runtime, tree-shakeable per-component Radix imports.

## Install & Usage

```bash
npm install tashil-ui
# or
pnpm add tashil-ui
```

Import the global styles once in your app root:

```tsx
import "tashil-ui/styles/global.css";
```

Set the theme and direction on a root element:

```tsx
<html dir="rtl" data-theme="zamyad">
  <body>
    <App />
  </body>
</html>
```

Import and use components:

```tsx
import { Button, TextField, Checkbox } from "tashil-ui";
import { IconPlus } from "tashil-ui/icons";

export default function Form() {
  return (
    <>
      <TextField label="Name" placeholder="Enter your name" />
      <Checkbox label="I agree" />
      <Button leadingIcon={<IconPlus />}>Create</Button>
    </>
  );
}
```

For custom themes, import the theme stylesheet alongside global styles:

```tsx
import "tashil-ui/styles/global.css";
import "tashil-ui/styles/themes/tashilpay.css"; // or zamyad, zhina
```

## Components

Currently shipped (8 core components):

| Component | Use case | Radix? |
|-----------|----------|--------|
| **Button** | Primary call-to-action. Intents: `primary \| secondary \| neutral \| success \| error`. Variants: `solid \| tonal \| outline \| ghost \| link`. Sizes: `sm \| md \| lg`. | No |
| **TextField** | Single-line text input. | No |
| **TextFieldSmall** | Compact variant of TextField. | No |
| **TextArea** | Multi-line text input. | No |
| **Checkbox** | Single checkbox selection. | Yes ✓ |
| **CheckboxGroup** | Group of checkboxes with shared state. | Yes ✓ |
| **Modal** | Dialog overlay for focused tasks. Includes `Modal` container and `ModalClose` button. | Yes ✓ |
| **Tooltip** | Contextual tip on hover/focus. Requires `<TooltipProvider>` ancestor. | Yes ✓ |

**Icons:** 340+ tree-shakeable React components, all 1em + `currentColor` (size with `font-size`, color via CSS cascade).

## Design Tokens

**TashilUI is the single source of truth for design tokens.** Tokens are authored as W3C DTCG JSON in `tokens/` and compiled to CSS custom properties:

```
tokens/*.json (Figma exports)
    ↓
scripts/build-tokens.mjs
    ↓
src/styles/{reference, typography, measurement}.css
src/styles/themes/{tashilpay, zamyad, zhina}.css
```

Regenerate tokens after pulling fresh exports from Figma:

```bash
pnpm run tokens
```

Generated CSS is git-ignored and must never be hand-edited. To change a token value, edit the source JSON (ultimately Figma) and rebuild.

**Token flow:**

- **TashilUI** → source of truth (this repo)
- **tashilcar-docs** → consumer + design reference (synced via `pnpm sync-docs`, opens a review PR)
- **Drift CI** → in tashilcar-docs, fails if its tokens fall behind TashilUI

## Theming

Every component uses only **semantic** custom properties (`--color-text-default`, `--space-4`, `--radius-md`, etc.). Products differ only in what those semantics resolve to.

Activate a theme by setting `data-theme` on a root element:

```html
<html data-theme="tashilpay">  <!-- or zamyad, zhina -->
```

All three themes are pre-compiled in `src/styles/themes/` and include full color, spacing, typography, and motion token sets.

## RTL & CSS Conventions

All components are **RTL-first** and use only **logical CSS properties** (no physical left/right). Examples:

- `margin-inline-start` (instead of `margin-left`)
- `padding-inline-end` (instead of `padding-right`)
- `inset-inline-start` (instead of `left`)
- `text-align: start` (instead of `text-align: left`)

The lint gate (`pnpm lint:css`) forbids hardcoded hex colors and physical properties in component CSS. RTL is the default; LTR also works via the `dir` attribute.

## Develop

### Setup

```bash
pnpm install
```

### Common tasks

```bash
pnpm run tokens           # regenerate token CSS from tokens/*.json
pnpm run icons            # regenerate icon components from src/icons/svg/*.svg
pnpm run storybook        # dev Storybook at http://localhost:6006 (RTL/theme toolbar + a11y)
pnpm run build            # library build (ESM + types → dist/)
pnpm run lint:css         # stylelint (forbids hex + physical properties)
pnpm run typecheck        # tsc --noEmit
pnpm run test-storybook   # run all stories as headless component tests (Vitest + Playwright)
pnpm run sync-docs        # push token changes → tashilcar-docs as a review PR (gh)
```

### File structure

Each component includes:
- `Component.tsx` — React component
- `Component.module.css` — semantic tokens + logical CSS only
- `Component.stories.tsx` — Storybook stories (all states × all themes × RTL/LTR)
- `Component.mdx` — Overview docs page
- `index.ts` — export

Add the export to `src/index.ts` and run `pnpm lint:css` + `pnpm typecheck`.

## Project Workflow

### Per-component Definition of Done

A component is complete only after all three steps:

1. **Figma review.** Compare the built component against the Figma spec and polish until it matches visually. Get user sign-off.
2. **Storybook stories.** Write stories covering every state × the 3 product themes × RTL and LTR. Add interaction tests (play functions). Ensure a11y addon passes.
3. **Overview docs.** Write an MDX Overview page in Storybook (e.g., `Components/Button ▸ Overview`).

### Build order

Components are built in priority order — **Swiss Army** core components first, then **Zhina** admin composites built on top.

See [ROADMAP.md](ROADMAP.md) for the full build queue and component dependencies.

### Rules

- **Semantic tokens only.** No hardcoded hex, rgb, px, or font sizes in `.module.css`. Use `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`, etc.
- **Logical CSS properties only.** `margin-inline-start`, `inset-inline-end`, `text-align: start`. Never `left`/`right`.
- **Radix only where needed.** Pure CSS for non-interactive components (Button, TextField). Radix for focus-trap/keyboard/ARIA-heavy ones (Modal, Checkbox, Tooltip).
- **Verify before committing:** `pnpm tokens && pnpm typecheck && pnpm build && pnpm lint:css` all pass; component renders correctly across themes + directions in Storybook.

See [AGENTS.md](AGENTS.md) for detailed conventions and the Storybook MCP API for AI agents.

## Learn more

- [AGENTS.md](AGENTS.md) — detailed working rules and gotchas
- [ROADMAP.md](ROADMAP.md) — milestone tracker and per-component workflows
- [Storybook](http://localhost:6006) — live component explorer (run `pnpm run storybook`)

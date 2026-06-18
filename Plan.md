# Plan: Swiss Army Component Library on Radix UI (greenfield)

## Context

Tashilcar's design system, **Swiss Army**, currently exists only as documentation in
this repo: W3C-format design tokens (`design-system/tokens-source/*.json`), 33 component
spec docs (`design-system/components/`), foundations (RTL, Persian, Jalali, Yekan Bakh
font), and per-product theming via aliased `primary`/`secondary` tokens
(TashilPay, Zamyad, Zhina; Peykan not yet tokenized). The Code Connect layer
(`design-system/code-connect/`) is empty.

There is **no front-end code yet** — no `package.json` anywhere. The docs assume an
MUI base, but we are deliberately starting fresh: a real React component library built
on **Radix UI primitives** (behavior + accessibility) styled with **100% our own CSS
Modules + CSS custom properties** — no Tailwind, no MUI, no shadcn. This serves the
project's stated goals: **fast loading** and **small files shipped to the browser**
(zero styling runtime; tree-shakeable Radix only on the genuinely hard components).

### Decisions locked in
- **Location:** brand-new separate repo (proposed name `tashil-ui`). This docs repo
  stays documentation-only and remains the source of truth for tokens + specs.
- **Styling:** CSS Modules + CSS custom properties (zero runtime).
- **Token pipeline:** Style Dictionary compiles the W3C JSON → CSS custom properties.
- **First milestone:** Foundations + 3–5 core components, then scale to all 33.

## Outcome

A versioned, installable React component library where every component is built from
Swiss Army tokens (never hardcoded values), is RTL/Persian-correct, and is wired to its
Figma component via Code Connect — closing the FE hand-off items in `ROADMAP.md`.

---

## Architecture of the new repo (`tashil-ui`)

```
tashil-ui/
├── package.json              # React 18, TS, Vite (library mode), Radix deps (per-component)
├── tsconfig.json
├── vite.config.ts            # build to ESM + types; externalize react/react-dom
├── style-dictionary.config.js
├── tokens/                   # vendored copy of the W3C JSON exports (synced from docs repo)
│   ├── 1. References Color.json
│   ├── 2. Product Tokens.{TashilPay,Zamyad,Zhina}.json
│   ├── 3. Typography.json
│   └── 4. Measurement.json
├── scripts/sync-tokens.mjs   # pulls latest tokens-source/*.json from the docs repo
├── src/
│   ├── styles/
│   │   ├── reference.css     # generated: primitive ramps (shades/*, alphas/*) as --ref-*
│   │   ├── themes/
│   │   │   ├── tashilpay.css # generated: semantic --color-text-default etc. for product
│   │   │   ├── zamyad.css
│   │   │   └── zhina.css
│   │   ├── typography.css    # generated: --font-*, type-scale steps (Title/Body/Caption)
│   │   ├── measurement.css   # generated: --space-*, --radius-*
│   │   ├── reset.css         # minimal, RTL-aware base
│   │   └── global.css        # @import order: reset → reference → typography → measurement
│   ├── lib/
│   │   ├── persian.ts        # toPersianDigits(), formatRial() (﷼), Jalali helpers
│   │   └── cx.ts             # tiny className joiner
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   └── … (one folder per component)
│   └── index.ts              # barrel export
├── .storybook/               # Storybook + RTL/Persian preview + theme switcher
└── code-connect/             # *.figma.ts mappings → mirrored back to docs repo
```

### Theming model (mirrors `design-system/tokens.md`)
- **One CSS file per product theme** under `src/styles/themes/`. Each defines the **same
  semantic custom-property names** (`--color-text-default`, `--color-bg-input`,
  `--color-primary-default`, …); only the values differ per product.
- Consumer apps set the active theme by applying a class/attribute on a root element
  (e.g. `<html data-theme="zamyad" dir="rtl">`). Components reference only semantic
  `var(--color-*)` / `var(--space-*)` — never primitives, never hex.
- Primitives (`--ref-shades-blue-500`, etc.) live in `reference.css`; product themes
  alias them, exactly like the JSON `{references.*}` aliases.
- Per `tokens.md`: ignore the deprecated `references.primary/secondary/gray.*` noise from
  the old V2.0 system; use the live per-product collections only. Peykan has no theme yet.

### Token pipeline (Style Dictionary)
- `style-dictionary.config.js` reads `tokens/*.json` and emits the generated CSS files
  above. Custom transform maps slash-namespaced names (`text/primary/hover`) →
  CSS custom properties (`--color-text-primary-hover`).
- `scripts/sync-tokens.mjs` copies the canonical exports from this docs repo's
  `design-system/tokens-source/` so Figma stays the single source of truth; regenerating
  is a single `npm run tokens` command. **Generated CSS is never hand-edited.**

### RTL / Persian (foundations.md)
- Library ships `dir`-agnostic CSS using **logical properties** only
  (`margin-inline-start`, `padding-inline-end`, `inset-inline-*`) — no `left`/`right`.
- `Button` leading icon = inline-start (visually right in RTL); trailing = inline-end.
- `src/lib/persian.ts` provides Persian-numeral and Rial (﷼) formatting; date components
  use Jalali. Yekan Bakh declared via `@font-face` in `typography.css` (font files
  bundled or referenced; confirm licensing with team).

---

## Component build pattern (applies to all 33)

For each component documented in `design-system/components/`:
1. Read its spec doc for variants, anatomy, **Tokens used**, and RTL notes
   (e.g. `button-primary.md` lines 22–41, `text-field.md` lines 22–36).
2. Wrap the relevant **Radix primitive** where one exists (Dialog, DropdownMenu, Popover,
   Tooltip, Tabs, Checkbox, RadioGroup, Switch, Progress, Select). Hand-roll pure-CSS
   components with no behavioral needs (Button, TextField, TextArea, NumberField, Chips,
   StepperCircle) — zero JS beyond React.
3. Style with a `*.module.css` file consuming only semantic custom properties. Map Radix
   `[data-state=...]` / `[data-disabled]` attributes to state styles.
4. Expose a typed props API matching the documented variant axes (size, state, content,
   width). Default to controlled+uncontrolled support inherited from Radix.
5. Add a `*.stories.tsx` covering every state in both `dir=rtl` and each product theme.
6. Add a `code-connect/<Component>.figma.ts` mapping keyed by the doc's `figma_key`
   (e.g. Button/Primary `d120315d84467531a8ed303c2c07116cdf635d56`), then mirror it into
   this repo's `design-system/code-connect/` and update its `_index.md` table.

### Radix dependency map (install per-component, tree-shakeable)
| Swiss Army group | Components | Radix base |
|---|---|---|
| Buttons/actions | Button/*, ActionIcon | none (pure CSS) |
| Selection | Checkbox, CheckboxGroup, RadioButton, RadioGroup, Switch | `@radix-ui/react-checkbox`, `-radio-group`, `-switch` |
| Text inputs | TextField, TextFieldSmall, TextArea, NumberField, SearchField, OTP, PlateField, Chips | none (pure CSS + `react-aria`/custom for OTP) |
| Dropdowns/menus | DropMenu, Menu | `@radix-ui/react-dropdown-menu`, `-select` |
| Date & time | Calendar (Jalali), DatePicker | none from Radix → use a headless Jalali date lib + Radix Popover |
| File upload | Single/Multiple/BoxUploader | none (native input + custom) |
| Overlays/feedback | Modal, Dialogbox, ScrimBG, Tooltip, Progress, StepperCircle | `@radix-ui/react-dialog`, `-tooltip`, `-progress` |
| Navigation/layout | Tabs, Pages (pagination), Scrollbar | `@radix-ui/react-tabs`, `-scroll-area`; Pages custom |

> Calendar/DatePicker are the highest-risk items (Jalali + RTL); Radix has no date
> primitive, so pair a headless Jalali engine with Radix Popover. Flag for extra time.

---

## Milestone 1 (first slice — validates the whole architecture)

1. Scaffold repo: Vite library mode, TS, ESLint + **Stylelint** (enforce no hex / no
   physical properties), Storybook, package exports (ESM + types + CSS entrypoints).
2. Token pipeline end-to-end: `sync-tokens` + Style Dictionary → generate
   `reference.css`, three product theme files, `typography.css`, `measurement.css`.
3. Foundations: `reset.css`, `global.css`, `persian.ts`, Yekan Bakh `@font-face`,
   Storybook theme + `dir` switcher.
4. Build **5 core components** proving each pattern:
   - **Button/Primary** — pure CSS, variants/states, RTL icon order.
   - **TextField** — pure CSS, label/helper/error, adornments, ﷼ trailing.
   - **Checkbox** — Radix primitive + custom CSS.
   - **Modal** — Radix Dialog (focus trap, scroll lock, ScrimBG).
   - **Tooltip** — Radix Tooltip.
5. One `*.figma.ts` Code Connect mapping (Button/Primary) wired and mirrored back, to
   prove the design↔code loop.

Exit criteria: `npm run build` produces a tree-shakeable package; Storybook renders all
5 components in RTL across all three product themes; Stylelint passes (no hardcoded
values); bundle size of the 5 components measured and recorded as a baseline.

## Subsequent milestones
- **M2:** remaining Buttons + all Text inputs (incl. PlateField, OTP).
- **M3:** Selection + Dropdowns/Menus + Tabs/Pages/Scrollbar.
- **M4:** Overlays/feedback (Dialogbox, Progress, StepperCircle).
- **M5:** Uploaders + Calendar/DatePicker (Jalali) — budget extra time.
- **M6:** Per-product UI-Kit packages (Zhina tables/cards, TashilPay payment cards) on top
  of the core library; Peykan token collection added when migrated.

---

## Verification
- **Per component:** Storybook stories render every state in `dir=rtl` and each product
  theme; visual check that icons/alignment flip correctly and numerals/﷼ are Persian.
- **Tokens:** confirm generated CSS custom properties match `tokens-color.md` /
  `tokens-measurement.md`; switching `data-theme` re-themes with no component change.
- **A11y:** run `@storybook/addon-a11y` (axe) on each story; keyboard-nav and screen-reader
  pass for Modal/Tooltip/Menu/Checkbox (Radix-backed).
- **Bundle/perf (the project goals):** `vite build` + size report per entrypoint; assert
  the CSS layer ships zero JS runtime and Radix is imported per-component (tree-shaken).
- **Lint gate:** Stylelint blocks hex colors and physical (`left`/`right`) properties in
  `*.module.css`.
- **Design loop:** Code Connect mapping resolves the Figma `figma_key` to the code
  component; `design-system/code-connect/_index.md` table updated.

## Open items to confirm with the team
- New repo name + where it's hosted (GitHub org) and how it consumes tokens (vendored
  copy via `sync-tokens` vs. git submodule of this repo).
- Yekan Bakh font licensing / file hosting.
- Jalali date engine choice for Calendar/DatePicker.
- Package manager (npm vs pnpm) — pnpm recommended even for a single package.
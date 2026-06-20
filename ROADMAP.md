# TashilUI — Roadmap

Milestone tracker for the Swiss Army component library (Radix + CSS Modules + tokens, no
Tailwind/MUI/shadcn). Working rules are in [AGENTS.md](AGENTS.md).

## Current state (as of 2026-06-17) — Milestone 1 ✅ complete & verified

**Done**
- Repo scaffolded (pnpm, Vite library mode, TS, git), dependencies installed.
- **Token pipeline** (`scripts/build-tokens.mjs`, `pnpm tokens`): compiles the Figma W3C
  exports → CSS custom properties with **zero unresolved aliases**. Emits `reference.css`,
  `measurement.css`, `typography.css`, `themes/{tashilpay,zamyad,zhina}.css`. Brand
  differentiation verified (TashilPay `#15357A` vs Zamyad/Zhina `#2463EB`).
- **Foundations:** `reset.css` (RTL default), `global.css`, `fonts.css` (Yekan Bakh
  `@font-face`), `lib/persian.ts`, `lib/cx.ts`.
- **5 components + stories:** `Button` + `TextField` (pure CSS), `Checkbox` + `Modal` +
  `Tooltip` (Radix). Barrel `src/index.ts`.
- **Storybook** `main.ts` (+ `viteFinal` that strips the library build settings so SB's
  own build works) + `preview.tsx` with RTL/LTR + product-theme toolbar + a11y addon.
- **Verification — all green:** `pnpm tokens`, `pnpm typecheck`, `pnpm lint:css`,
  `pnpm build` (tree-shakeable: Radix stays external, per-component CSS, 13 `.d.ts`),
  and `CI=1 pnpm build-storybook` (all stories compile).

**M1 bundle baseline** (gzip, per component, JS + CSS module; Radix/React excluded as peers):
| Component | JS (logic) | JS (css-module shim) | CSS |
|---|---|---|---|
| Button | 0.50 kB | 0.42 kB | 0.82 kB |
| TextField | 0.67 kB | 0.36 kB | 0.64 kB |
| Checkbox | 0.63 kB | 0.21 kB | 0.50 kB |
| Modal | 0.71 kB | 0.29 kB | 0.72 kB |
| Tooltip | 0.44 kB | 0.16 kB | 0.31 kB |

Shared: `index` 0.33 kB, `persian` 0.41 kB, `cx` 0.12 kB (gzip).

## Radix base per component group (install per-component, tree-shakeable)

| Group | Components | Radix base |
|---|---|---|
| Buttons/actions | Button ✅ (all 5 intents × 5 styles × 3 sizes, icon-only, verified vs Figma), ActionIcon | none (pure CSS) |
| Selection | Checkbox ✅, CheckboxGroup, RadioButton, RadioGroup, Switch | `react-checkbox`, `-radio-group`, `-switch` |
| Text inputs | TextField ✅, TextFieldSmall, TextArea, NumberField, SearchField, OTP, PlateField, Chips | none (custom; OTP needs care) |
| Dropdowns/menus | DropMenu, Menu | `react-dropdown-menu`, `-select` |
| Date & time | Calendar (Jalali), DatePicker | Radix Popover + headless Jalali engine |
| File upload | Single/Multiple/BoxUploader | none (native input + custom) |
| Overlays/feedback | Modal ✅, Dialogbox, ScrimBG, Tooltip ✅, Progress, StepperCircle | `react-dialog`, `-tooltip`, `-progress` |
| Navigation/layout | Tabs, Pages (pagination), Scrollbar | `react-tabs`, `-scroll-area`; Pages custom |

## Build order & per-component workflow

Build components **in the order below** — all of **Swiss Army** first, then **Zhina**.
Zhina composites build _on top of_ finished Swiss Army primitives, so Swiss Army must
come first.

### Per-component Definition of Done

A component is only "done" once it has been **built** (its `.tsx` + `.module.css` + `index.ts`,
exported from `src/index.ts`, semantic tokens + logical CSS only, Radix only where needed) and
then passed **all three** steps, in order:

1. **Review & polish against Figma** — and **ask the user whether they see any visual difference**
   before signing it off.
2. **Add it to Storybook** — stories for every state × 3 themes × RTL/LTR, plus `play` tests.
3. **Write its Overview** — an `Overview` MDX docs page.

The operational details of all three steps (scaffold, Figma tooling, the Haiku-authored Overview,
verification) live in the **`/new-component` skill** — use it to build a component.

### Part A — Swiss Army (do first)

**Done (M1):**
- [x] **Button** — built, Figma-reviewed, stories + interaction tests, Overview. ✅ fully done
- [~] **TextField** — built + stories. _Needs: Figma review, Overview._
- [~] **Checkbox** — built + stories. _Needs: Figma review, Overview._
- [~] **Modal** — built + stories. _Needs: Figma review, Overview._
- [~] **Tooltip** — built + stories. _Needs: Figma review, Overview._

**To build, in order:**
1. [ ] ActionIcon
2. [ ] Switch
3. [ ] RadioButton
4. [ ] RadioGroup
5. [ ] CheckboxGroup
6. [ ] TextFieldSmall
7. [ ] TextArea
8. [ ] NumberField
9. [ ] SearchField
10. [ ] Chips
11. [ ] OTP _(needs care — per-cell focus management)_
12. [ ] PlateField _(Iranian license plate — domain-specific)_
13. [ ] Progress
14. [ ] ScrimBG _(extract from Modal)_
15. [ ] Dialogbox
16. [ ] StepperCircle
17. [ ] Tabs
18. [ ] Pages _(pagination)_
19. [ ] Scrollbar
20. [ ] DropMenu
21. [ ] Menu
22. [ ] Calendar _(Jalali + RTL — highest risk; budget extra time)_
23. [ ] DatePicker _(Desktop + Mobile; depends on Calendar)_
24. [ ] SingleUploader
25. [ ] MultipleUploader
26. [ ] BoxUploader

### Part B — Zhina components (`db.*`, after Swiss Army)

Admin composites for [Zhina](../Tashilcar/products/zhina.md), built on Swiss Army. Figma
file `4PfDNeqwsSF36NJ17qkXsb` (see `ui-kits/zhina-kit.md`). Same 3-step DoD each.

**Table system (core — build first):**
1. [ ] Template/Table _(+ Header/Table columns, domain status cells)_
2. [ ] db.Table Columns
3. [ ] db.Table Pagination _(+ PerPage, Footer)_
4. [ ] In-line Action + db.BulkAction
5. [ ] db.TableStatics

**Layout & shell:**
6. [ ] db.Sidebar
7. [ ] Layout/Pages
8. [ ] Layout/Filter
9. [ ] Layout/Steps
10. [ ] Layout Action / View Button / Empty Icon

**Cards (dashboard):**
11. [ ] db.Order Status Card
12. [ ] db.OrdersSection Card
13. [ ] db.Loan Type Card
14. [ ] db.Statics Card / Report Cards
15. [ ] db.DocumentCard
16. [ ] db.Empty State Card
17. [ ] Terminal Card

**Permissions & roles:**
18. [ ] Role Card
19. [ ] Permission Cards (+ Title, List)
20. [ ] Permission List / Roles Permission List / Permission Footer

**Tickets & content:**
21. [ ] db.TicketCard (+ Ticket Status, message-card)
22. [ ] db.TextEditor
23. [ ] db.RoadMap

> After Zhina: TashilPay UI-kit (`up.*`) and the Peykan theme — scoped later.

## Icon library ✅ landed (340 icons)

The official set is in. Pipeline built (`scripts/build-icons.mjs`, `pnpm icons`):
- **Source:** raw Figma SVGs vendored in `src/icons/svg/` (committed, never edited).
- **Generated:** one tree-shakeable React component per icon → `src/icons/Icon<Name>.tsx`
  + barrel `src/icons/index.ts` (git-ignored, regenerated by the build).
- **Normalization (all programmatic):** hardcoded fills (`black`/hex/`none`) stripped so
  icons inherit `currentColor`; fixed `width/height` dropped for `1em`; kebab attrs →
  camelCase JSX; odd grids (e.g. `Group` 20×20) scaled onto the 24 grid; `Icon`-prefixed
  PascalCase names with collision-safe dedupe (`Square-1` → `IconSquare1`).
- **Packaging:** subpath export `tashil-ui/icons` (second Vite lib entry, `preserveModules`
  → each icon its own chunk, ~1.4 kB raw / ~0.5 kB gzip).
- **Storybook:** `Foundations/Icons` — searchable gallery + a color/size proof story.
- Verified: typecheck, lint:css, build (340 chunks in `dist/icons/`), live render shows
  fills following the `--color-icon-*` cascade and sizes tracking `font-size`.

Status / decisions:
- [x] **Wired into components** — the icon API is set-agnostic: `Button` (and future fields)
      take any `ReactNode` via `leadingIcon` / `trailingIcon` / children
      (`leadingIcon={<IconPlus />}`), and the Button stories use the real set. Nothing is
      hardcoded to a specific icon, so there's nothing left to wire.
- [x] **Keep in-repo** (decided) — icons live in this repo while it's the only consumer.
      Revisit a separate `@tashil/icons` package only when a second app needs them.
- [x] **`-1` names are distinct icons, not dupes** — verified by diffing the SVGs
      (`Square` ≠ `Square-1`, `SwitchHorizontal` ≠ `SwitchHorizontal-1`,
      `HelpShield` ≠ `HelpShield-1`). Keep both.

Optional, low priority (needs design input — no functional impact):
- [ ] Rename the non-descriptive sources for clearer exports: `Square-1` / `SwitchHorizontal-1`
      / `HelpShield-1` (→ `IconSquare1`…) and the camelCase `interestRate`, `backToUpArrow`.
      Drop the new SVG in `src/icons/svg/` under the agreed name and rebuild.

## Open decisions to confirm with the team
- ~~Token source of truth~~ — done: **TashilUI is the source of truth**; tokens authored in
  `tokens/` flow out to the docs repo via `pnpm sync-docs` (PR), enforced by a drift CI there.
- ~~Yekan Bakh font hosting~~ — done: bundled as woff2 (Medium/Bold/Heavy) in
  `src/styles/fonts/`, shipped via `dist/styles`. (Confirm redistribution licensing.)
- Jalali date engine for Calendar/DatePicker.
- Package name on npm (`tashil-ui` assumed in imports).

# TashilUI — Roadmap

Milestone tracker for the Swiss Army component library (Radix + CSS Modules + tokens, no
Tailwind/MUI/shadcn). Working rules are in [AGENTS.md](AGENTS.md).

## Current state (as of 2026-06-23) — M1 ✅; Swiss Army build well underway

**Foundations (M1) — done & verified**
- Repo scaffolded (pnpm, Vite library mode, TS, git), dependencies installed.
- **Token pipeline** (`scripts/build-tokens.mjs`, `pnpm tokens`): compiles the Figma W3C
  exports → CSS custom properties with **zero unresolved aliases**. Emits `reference.css`,
  `measurement.css`, `typography.css`, `themes/{tashilpay,zamyad,zhina}.css`. Brand
  differentiation verified (TashilPay `#15357A` vs Zamyad/Zhina `#2463EB`).
- **Foundations:** `reset.css` (RTL default), `global.css`, `fonts.css` (Yekan Bakh
  `@font-face`), `lib/persian.ts`, `lib/cx.ts`.
- **Icon library** — 340 generated icons (see section below).
- **Storybook** `main.ts` (+ `viteFinal` that strips the library build settings) + `preview.tsx`
  with RTL/LTR + product-theme toolbar + a11y addon. Stories grouped under **Foundations**,
  **Base Components** (atomic sub-components), and **Components** (composed/standalone).
- **Verification — all green:** `pnpm tokens`, `pnpm typecheck`, `pnpm lint:css`, `pnpm build`
  (tree-shakeable: Radix stays external, per-component CSS), `CI=1 pnpm build-storybook`.

**Components shipped (23):** Button, TextField, TextFieldSmall, TextArea, OTPField, SearchField,
Checkbox, CheckboxGroup, RadioButton, RadioGroup, Switch, Modal, Tooltip, the chip/file atoms
(InputChip, InputChips, InputFilePreview), the DropMenu family (DropMenu, DropMenuList,
DropMenuItem, DropMenuAddItem), the Menu family (Menu, MenuItem + sections/radio helpers), and
Dropdown. All have stories; 15 have Overview MDX (the Base Components atoms are documented inside
their parent's Overview rather than individually).

Added Radix deps since M1: `@radix-ui/react-popover` (DropMenu), `@radix-ui/react-dropdown-menu`
(Menu). DropMenu/Menu panels cap their height to the viewport (`collisionPadding=16`).

## Radix base per component group (install per-component, tree-shakeable)

| Group | Components | Radix base |
|---|---|---|
| Buttons/actions | Button ✅, ActionIcon | none (pure CSS) |
| Selection | Checkbox ✅, CheckboxGroup ✅, RadioButton ✅, RadioGroup ✅, Switch ✅ | `react-checkbox`, `-radio-group`, `-switch` |
| Text inputs | TextField ✅, TextFieldSmall ✅, TextArea ✅, SearchField ✅, OTPField ✅, InputChip/InputChips ✅, InputFilePreview ✅, NumberField, PlateField | none (custom; OTP needs care) |
| Dropdowns/menus | DropMenu ✅, Menu ✅, Dropdown ✅ | `react-popover` (DropMenu/Dropdown), `react-dropdown-menu` (Menu) |
| Date & time | Calendar (Jalali), DatePicker | Radix Popover + headless Jalali engine |
| File upload | Single/Multiple/BoxUploader _(InputFilePreview ✅ is the thumbnail atom)_ | none (native input + custom) |
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

**Done — built + stories + Overview (full DoD):**
- [x] **Button** ✅ (Figma-reviewed, interaction tests, Overview)
- [x] **TextField** ✅
- [x] **TextFieldSmall** ✅
- [x] **TextArea** ✅
- [x] **OTPField** ✅ _(per-cell focus management)_
- [x] **SearchField** ✅
- [x] **Checkbox** ✅
- [x] **CheckboxGroup** ✅
- [x] **RadioButton** ✅
- [x] **RadioGroup** ✅
- [x] **Switch** ✅
- [x] **Tooltip** ✅
- [x] **InputChip / InputChips** ✅ _(the Figma "Chips" — chip atom + row, Base Components)_
- [x] **InputFilePreview** ✅ _(file thumbnail atom, Base Components)_
- [x] **DropMenu** ✅ _(+ Base atoms DropMenuList / DropMenuItem / DropMenuAddItem; Radix Popover)_
- [x] **Menu** ✅ _(+ MenuItem / MenuSection / MenuRadioGroup·Item; Radix DropdownMenu)_
- [x] **Dropdown** ✅ _(select field composing DropMenu + InputChips)_

**Done — built + stories, Overview still missing:**
- [~] **Modal** — _Needs: Overview MDX._

**To build, in order:**
1. [ ] ActionIcon
2. [ ] NumberField
3. [ ] PlateField _(Iranian license plate — domain-specific)_
4. [ ] Progress
5. [ ] ScrimBG _(extract from Modal)_
6. [ ] Dialogbox
7. [ ] StepperCircle
8. [ ] Tabs
9. [ ] Pages _(pagination)_
10. [ ] Scrollbar
11. [ ] Calendar _(Jalali + RTL — highest risk; budget extra time)_
12. [ ] DatePicker _(Desktop + Mobile; depends on Calendar)_
13. [ ] SingleUploader
14. [ ] MultipleUploader
15. [ ] BoxUploader

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

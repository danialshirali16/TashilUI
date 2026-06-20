# Component conventions

How to build a component well, once you've decided to build one. The hard rules live in
[CLAUDE.md](../CLAUDE.md); the end-to-end workflow (Figma review → stories → Overview) lives in
the `/new-component` skill. This file is the **implementation reference** — the patterns this
library has settled on. Read the section relevant to what you're building.

## The build pattern

1. Read the spec doc in `../Tashilcar/design-system/components/<name>.md` (variants, anatomy,
   **Tokens used**, RTL notes) — and grep `src/styles/themes/*.css` for the exact token names
   available. (If the docs repo isn't present, skip it and build from Figma — see
   CLAUDE.md "Working without the docs repo".)
2. Choose pure-CSS vs a Radix primitive (see the table in [ROADMAP.md](../ROADMAP.md)).
3. Build `.module.css` with semantic tokens + logical props; map Radix `[data-state]` /
   `[data-disabled]` attributes to styles.
4. Type the props to the documented variant axes (size / state / content / width).
5. Write stories for every state × theme × direction (incl. `play`-function tests), then the
   Overview MDX.

Every component ships: `Component.tsx`, `Component.module.css`, `index.ts`,
`Component.stories.tsx`, `Component.mdx`. Add the export to `src/index.ts`. Look at an existing
component of the same shape before starting — `TextField` for inputs, `Button` for many-variant
controls, `Checkbox` for Radix-backed ones.

## Field components (TextField, TextArea, TextFieldSmall)

These share a structure and a set of patterns — match them when adding new inputs.

- **Wrapper structure:** a `.field` (column: control + message) wrapping a `.control` (the
  bordered box) and a `.message` (helper/error). Status is driven by data-attributes on
  `.field`: `data-status="error"`, `data-disabled`, `data-readonly`. Stylesheets key off those.
- **Floating label (TextField, TextArea):** the label is a *sibling after* the input/textarea
  and floats via `:placeholder-shown`. A non-empty placeholder is required for the float to
  work — default `placeholder` to `" "` when none is given. Logical positioning only
  (`inset-block-start`, `inset-inline`).
- **Numeric input:** never re-implement digit handling. Use `src/lib/numericInput.ts`. Setting
  `inputMode` to `"numeric"`/`"decimal"` (or `type="number"`) normalizes Persian/Arabic-Indic
  digits to ASCII as the user types. The custom `inputMode="currency"` additionally groups the
  number into thousands with the `٬` separator (integers only — decimals/non-digits stripped)
  and maps to DOM `inputMode="numeric"`. The helper preserves the caret by digit count. To
  widen `inputMode` to `"currency"`, `Omit` the native `inputMode` from the extended props and
  redeclare it as `TextInputMode`.
- **Auto-grow textarea (TextArea):** height tracks content — on input, reset
  `style.height = "auto"` then set it to `scrollHeight`; re-fit in a `useLayoutEffect` for
  controlled `value` and on mount. CSS uses `resize: none; overflow: hidden`. Keep a min height.
- **Clear button (TextFieldSmall):** `clearable` renders a built-in ✕ that shows only when the
  field has a value, empties it via the native value setter (so React's `onChange` fires with
  the empty value), refocuses the input, and is suppressed when `disabled`/`readOnly`. Merge the
  forwarded ref with an internal ref so the handler can reach the element.
- **Optional/required:** default to required (native `required` set); `optional` removes it. For
  labelled fields, render the «(اختیاری)» marker next to the label. For **label-less** variants
  (TextFieldSmall), append «(اختیاری)» to the placeholder so it shows while empty and disappears
  on typing — there's nowhere else to put it.

### Accessibility note that bites

**Read-only = the native `readonly` attribute.** It keeps the field focusable, selectable, and
announced to assistive tech. Do **not** claim `aria-readonly="true"` or "removed from tab order"
in docs or code — that's `disabled`, not `readonly`. (This has been written wrong more than once.)

## Many-variant controls (Button)

`<Button>` has four axes mirroring the Figma component set:
- `intent`: `primary | secondary | neutral | success | error` (the Figma component name)
- `variant` (Figma "Style"): `solid | tonal | outline | ghost | link`
- `size`: `sm` (32px) | `md` (40px) | `lg` (48px) — Body type scale, weight 500, radius 4/6/8
- `iconOnly` (square 32/40/48), plus `leadingIcon` / `trailingIcon`, `loading`, `fill`, `disabled`

Colors are wired with per-(variant,intent) custom properties (`--tu-bg`, `--tu-fg`,
`--tu-bg-hover`, …) so base rules stay DRY. **Follow this pattern for any new component with many
style/intent combinations** — set the `--tu-*` vars per combination, write the visual rules once.

## Docs

The `Overview` MDX page is authored by a **Haiku 4.5 sub-agent** as a standard step (see the
`/new-component` skill for the exact brief and the accuracy checklist). Mirror the structure of
an existing Overview (e.g. `TextField.mdx`): intro, when-to-use, per-feature sections with
`<Canvas>`, accessibility, token-driven styling, then `<Controls>` + `<ArgTypes>`.

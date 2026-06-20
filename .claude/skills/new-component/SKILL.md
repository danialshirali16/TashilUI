---
name: new-component
description: Build a new TashilUI component end-to-end (scaffold + the per-component Definition of Done). Use when the user asks to build/add/create a component, or to take a component through its Figma review, Storybook stories, and Overview docs. Triggers like "build the Switch component", "let's do RadioButton next", "add ActionIcon".
---

# Build a TashilUI component

Owns the full per-component workflow. Read [CLAUDE.md](../../../CLAUDE.md) for the hard rules and
[docs/conventions.md](../../../docs/conventions.md) for implementation patterns before coding.

The component name and (usually) a Figma URL come from the user. If no Figma URL is given, find the
`figma_key` in the docs catalog (`../Tashilcar/design-system/components/_index.md` for Swiss Army,
`ui-kits/zhina-kit.md` for Zhina).

## Step 0 — Scaffold & build

1. Pick the closest existing component as a template and read it: `TextField` for inputs, `Button`
   for many-variant controls, `Checkbox` for Radix-backed controls. Match its file layout and
   patterns.
2. Read the spec: `../Tashilcar/design-system/components/<name>.md` (variants, anatomy, **Tokens
   used**, RTL notes). Grep `src/styles/themes/*.css` for the exact token names available.
3. Decide pure-CSS vs Radix (table in [ROADMAP.md](../../../ROADMAP.md)). Pull Radix per-component
   only when accessibility/interaction demands it.
4. Create the files under `src/components/<Name>/`: `<Name>.tsx`, `<Name>.module.css`, `index.ts`,
   `<Name>.stories.tsx`. Semantic tokens + logical CSS only. Type props to the documented variant
   axes. Add the export to `src/index.ts`.
5. Verify the build gate: `pnpm typecheck && pnpm lint:css` (and `pnpm build` before final sign-off).

## Step 1 — Review & polish against Figma (requires user sign-off)

1. Pull the Figma design: `get_screenshot` + `get_design_context` + `get_variable_defs` for the
   component node. (Code Connect is intentionally removed from this repo — skip its prompts.)
2. Compare the built component to Figma across states/variants and polish until it matches —
   spacing, radii, colors, typography, motion, RTL.
3. Verify live against the running Storybook (the user owns the `:6006` server; start it only if
   none is running). Use the preview tools to check computed styles and take screenshots.
4. **Ask the user whether they see any visual difference.** Do NOT sign the component off until
   they confirm it matches. Surface any intentional deviations (e.g. web-native behaviors) for
   confirmation.

## Step 2 — Storybook stories

Write stories covering every state × the 3 product themes × RTL/LTR. Interactive components get
`play`-function interaction tests. Follow [docs/storybook.md](../../../docs/storybook.md) exactly
(import from `storybook/test`, use the `canvas` arg, etc.). Call the Storybook MCP's
`get-storybook-story-instructions` first and `preview-stories` after. Keep the a11y addon clean.

## Step 3 — Overview MDX (delegate to Haiku 4.5)

Author the `Overview` MDX page with a **Haiku 4.5 sub-agent** (the `Agent` tool, `model: "haiku"`).
The brief MUST tell it to:

- Start with `import { Meta, Canvas, Controls, ArgTypes } from "@storybook/addon-docs/blocks";`
  (Storybook 10 — NOT `@storybook/blocks`), then `import * as <Name>Stories`, then
  `<Meta of={<Name>Stories} name="Overview" />`.
- Read a sibling Overview (e.g. `TextField.mdx`) for house style, and the real component +
  stories files so it references only **real** props and story exports.
- Mirror the structure: intro, when-to-use, per-feature sections with `<Canvas of={...} />`,
  accessibility, token-driven styling, then `<Controls of={...} />` + `<ArgTypes of={...} />`.
- Verify before finishing: `pnpm typecheck` and `pnpm build-storybook` both pass.

**Then review the sub-agent's output yourself** for accuracy — it tends to get a11y wording wrong.
In particular, fix any claim that read-only sets `aria-readonly` or "removes from tab order"
(read-only uses the native `readonly` attribute and stays focusable — see docs/conventions.md).

## Done

`pnpm tokens && pnpm typecheck && pnpm build && pnpm lint:css` all green; renders across themes +
directions. Commit to TashilUI `main` (this repo pushes direct, no PR) with the message ending:
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Only commit/push when the user asks.

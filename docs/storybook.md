# Storybook & testing

Storybook is the workbench and the test runner. Read this before writing or editing stories.

## Storybook MCP (for AI agents)

Storybook **10** runs the official `@storybook/addon-mcp`, serving an MCP endpoint at
`http://localhost:6006/mcp` whenever `pnpm storybook` is up. The project `.mcp.json` registers it
as `storybook-mcp` (http transport), so Claude Code auto-connects when both are running (approve
the project server once). Tools: `list-all-documentation`, `get-documentation`,
`get-documentation-for-story`, `get-storybook-story-instructions`, `preview-stories`.

**Before writing/editing components or stories, call `get-storybook-story-instructions`** for the
framework-correct import/story patterns, and `preview-stories` after, surfacing the returned
preview URLs.

## Stories

- Cover every state × the **3 product themes** × **RTL and LTR** (Storybook toolbar switches
  theme/direction).
- **Interactive components get `play`-function interaction tests.** Import `fn`, `userEvent`,
  `expect` from `storybook/test` (**not** `@storybook/test`); use the `canvas` play arg directly
  (never `within(canvas)`); spy callbacks with `fn()` in `meta.args`. See the `Test:` stories in
  `Button.stories.tsx`.
- Run the a11y addon and keep it clean.

## Component tests

`@storybook/addon-vitest` runs all stories headless via Vitest browser mode (`vitest.config.ts`,
kept separate from the lib `vite.config.ts`). `play`-function tests assert behavior; other stories
get a smoke-render. Run with `pnpm test-storybook`.

- Playwright's CDN is geo-blocked here, so `vitest.config.ts` points at a locally-cached Chromium.
  Override with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, or run
  `pnpm exec playwright install chromium` from an unblocked network.
- In a real browser, `userEvent.click` throws on `pointer-events: none` elements — pass
  `{ pointerEventsCheck: 0 }` to test that disabled/loading controls stay inert.

Per-component acceptance: renders in all 3 themes and RTL+LTR; axe a11y passes; keyboard/
screen-reader works for Radix-backed ones; no hardcoded values (lint gate).

## Storybook v10 specifics

- MDX doc blocks import from `@storybook/addon-docs/blocks` (**not** the removed
  `@storybook/blocks`). Essentials (viewport/controls/interactions/actions) are built into core —
  the addons list is just `addon-a11y`, `addon-docs`, `addon-mcp`.
- Storybook **reuses `vite.config.ts`**, which is tuned for the *library* build (externalizes
  React, `preserveModules`, `dts`). `.storybook/main.ts` has a `viteFinal` that strips those —
  keep it, or SB fails to resolve `@storybook/react/...entry-preview`. `@storybook/react` is also
  a direct devDependency (pnpm won't resolve it transitively).
- `Tooltip` requires a `<TooltipProvider>` ancestor (already in the Storybook preview).

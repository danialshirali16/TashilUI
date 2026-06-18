// Vitest config for running Storybook stories as headless component tests
// (the addon-vitest "Get started" workflow). Kept separate from the root
// vite.config.ts (which is the LIBRARY build) — Vitest prefers this file and
// ignores vite.config.ts, so the lib settings (preserveModules, externals,
// dts) never leak into the test run. The storybookTest plugin loads
// .storybook/main.ts, so the framework's viteFinal still applies. Since
// Storybook 10.3 the addon auto-applies preview.tsx annotations (themes,
// direction, decorators), so no setup file is needed.
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const root = dirname(fileURLToPath(import.meta.url));

// Playwright's CDN is geo-blocked here, so the bundled Chromium can't download.
// Fall back to a locally-cached Playwright Chromium if one exists; otherwise use
// Playwright's default resolution (set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, or run
// `pnpm exec playwright install chromium` from an unblocked network).
const cachedChromium = join(
  homedir(),
  "Library/Caches/ms-playwright/chromium-1169/chrome-mac/Chromium.app/Contents/MacOS/Chromium",
);
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync(cachedChromium) ? cachedChromium : undefined);

export default defineConfig({
  plugins: [storybookTest({ configDir: join(root, ".storybook") })],
  test: {
    name: "storybook",
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({ launchOptions: executablePath ? { executablePath } : undefined }),
      instances: [{ browser: "chromium" }],
    },
  },
});

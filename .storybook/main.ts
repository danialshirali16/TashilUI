import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
    "@storybook/addon-vitest"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // The root vite.config.ts is tuned for the LIBRARY build (externalizes React,
  // preserveModules, emits .d.ts). Those settings break Storybook's app build,
  // so strip them here — Storybook needs React bundled and no lib/dts output.
  async viteFinal(viteConfig) {
    if (viteConfig.build) {
      delete viteConfig.build.lib;
      delete viteConfig.build.rollupOptions;
    }
    viteConfig.plugins = (viteConfig.plugins ?? []).filter((p) => {
      const name =
        p && typeof p === "object" && "name" in p ? String(p.name) : "";
      return !name.includes("dts");
    });
    return viteConfig;
  },
};

export default config;

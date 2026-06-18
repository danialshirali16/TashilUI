import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const root = fileURLToPath(new URL(".", import.meta.url));

// Library build: ESM, types, and per-module output so consumers tree-shake
// down to just the components (and their CSS) they import.
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["src"], exclude: ["src/**/*.stories.tsx"] }),
  ],
  css: {
    modules: {
      // Stable, debuggable class names: tu-<Component>-<class>-<hash>
      generateScopedName: "tu-[name]-[local]-[hash:base64:4]",
    },
  },
  build: {
    lib: {
      // Two entries: the main API and the icons subpath (`tashil-ui/icons`).
      // preserveModules keeps every icon its own chunk so consumers tree-shake
      // down to only the icons they import.
      entry: {
        index: resolve(root, "src/index.ts"),
        "icons/index": resolve(root, "src/icons/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      // react/react-dom and Radix stay external — never bundled into the lib.
      external: (id) =>
        id === "react" ||
        id === "react-dom" ||
        id.startsWith("react/") ||
        id.startsWith("react-dom/") ||
        id.startsWith("@radix-ui/"),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: "styles/[name][extname]",
      },
    },
    sourcemap: true,
    cssCodeSplit: true,
  },
});

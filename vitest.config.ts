// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    alias: {
      "@": "/src",
    },
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html", "lcov", "json"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/provider.tsx",
        "src/config/site.ts",
        "src/types/**/*.ts",
        "src/styles/**/*.css",
        "src/components/primitives.ts",
        "src/App.tsx",
        "src/layouts/default.tsx",
        "src/components/icons.tsx",
      ],
      all: true,
      reportOnFailure: true,
      thresholds: {
        // You can set a global threshold for all files using '100':
        // '100': { // This means 100% of files must meet these individual thresholds
        //   lines: 80,
        //   functions: 80,
        //   branches: 80,
        //   statements: 80,
        // },
        // OR, more simply, set global thresholds directly:
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        // Vitest will also fail if these global values aren't met.
        // If you also had per-file thresholds, those would take precedence for those files.
      },
      // ---- END: Enforce Coverage Thresholds ----
    },
  },
});

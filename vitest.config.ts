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
      provider: "v8", // or 'istanbul'
      reporter: ["text", "json-summary", "html", "lcov", "json"], // Added 'json-summary' and 'lcov'
      reportsDirectory: "./coverage",
      // Files to include in coverage analysis
      include: ["src/**/*.{ts,tsx}"],
      // Files to exclude from coverage analysis
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
      // If you want to see coverage for all files (even those without tests)
      all: true,
      // ADD reportOnFailure AS RECOMMENDED
      reportOnFailure: true,
      // Your thresholds are already being picked up, which is good.
      // If you want the action to fail the build based on these,
      // the action itself can do that or Vitest can.
      // thresholds: { // These are correctly picked up by the action
      //   lines: 80,
      //   functions: 80,
      //   branches: 80,
      //   statements: 80,
      // }
    },
  },
});

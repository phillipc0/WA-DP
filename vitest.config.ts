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
      // TODO: Enable thresholds when coverage is sufficient
      // thresholds: {
      //   lines: 80,
      //   functions: 80,
      //   branches: 80,
      //   statements: 80,
      // },
    },
  },
});

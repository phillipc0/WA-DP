import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
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
        "src/App.tsx",
        "src/main.tsx",
        "src/provider.tsx",
        "src/vite-env.d.ts",
        "src/components/icons.tsx",
        "src/components/primitives.tsx",
        "src/config/site.ts",
        "src/layouts/default.tsx",
        "src/types/**/*.ts",
      ],
      all: true,
      reportOnFailure: true,
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});

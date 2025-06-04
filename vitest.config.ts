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
      reporter: ["text", "json-summary", "html", "lcov"], // Added 'json-summary' and 'lcov'
      reportsDirectory: "./coverage",
      // Files to include in coverage analysis
      include: ["src/**/*.{ts,tsx}"],
      // Files to exclude from coverage analysis
      exclude: [
        "src/main.tsx", // Entry point, often not unit tested directly
        "src/vite-env.d.ts", // Type definitions
        "src/provider.tsx", // Context providers can be tricky to unit test effectively
        "src/config/site.ts", // Configuration file
        "src/types/**/*.ts", // Type definitions
        "src/styles/**/*.css", // CSS files
        "src/components/primitives.ts", // Tailwind variants, less about logic
        "src/App.tsx", // Main router setup
        "src/layouts/default.tsx", // Layout component
        "src/components/icons.tsx", // Purely presentational SVG components
        // Add other files/patterns to exclude if they don't contain testable logic
        // e.g., storybook files, test utilities not in the `tests` dir
      ],
      // If you want to see coverage for all files (even those without tests)
      all: true,
      // Thresholds (optional, uncomment and adjust to enforce coverage)
      // lines: 80,
      // functions: 80,
      // branches: 80,
      // statements: 80,
    },
  },
});

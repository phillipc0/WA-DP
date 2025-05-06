import { fileURLToPath } from "url";
import { dirname } from "path";

import { defineConfig } from "cypress";
import createBundler from "@cypress/webpack-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  e2e: {
    supportFile: "cypress/support/index.ts",
    specPattern: "cypress/e2e/**/*.feature",
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          webpackOptions: {
            resolve: {
              extensions: [".ts", ".js"],
              alias: {
                "@": __dirname + "/src",
              },
            },
            module: {
              rules: [
                {
                  test: /\.ts$/,
                  exclude: /node_modules/,
                  use: [
                    {
                      loader: "ts-loader",
                      options: {
                        transpileOnly: true,
                      },
                    },
                  ],
                },
                {
                  test: /\.feature$/,
                  use: [
                    {
                      loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                      options: config,
                    },
                  ],
                },
              ],
            },
          },
        }),
      );

      return config;
    },
  },
});

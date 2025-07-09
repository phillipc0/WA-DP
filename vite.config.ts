import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    // ENABLE THIS AND ADD A NGINX CONFIG WITH NO-STORE IF CACHING PROBLEMS PERSIST
    // {
    //   name: "custom-caching",
    //   configureServer(server) {
    //     server.middlewares.use((req, res, next) => {
    //       if (req.url !== undefined && req.url.endsWith(".json")) {
    //         res.setHeader("Cache-Control", "no-store");
    //       }
    //       next();
    //     });
    //   },
    // },
  ],
  publicDir: "backend/frontend",
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});

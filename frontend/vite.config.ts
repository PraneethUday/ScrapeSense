import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        "popup-ui": resolve(__dirname, "src/extension/popup-ui.tsx"),
        ui: resolve(__dirname, "src/extension/ui.tsx"),
        content: resolve(__dirname, "src/extension/content.ts"),
        background: resolve(__dirname, "src/extension/background.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        dir: resolve(__dirname, "dist"),
        format: "es",
        assetFileNames: "[name][extname]",
      },
    },
    minify: false,
    cssCodeSplit: false,
  },
});

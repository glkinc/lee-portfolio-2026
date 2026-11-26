import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Keep SVG shape/logo assets as files so they cache well; small ones inline.
    assetsInlineLimit: 2048,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Set BASE_PATH=/lee-portfolio-2026/ for GitHub Pages; defaults to the domain root.
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
  build: {
    // Keep SVG shape/logo assets as files so they cache well; small ones inline.
    assetsInlineLimit: 2048,
  },
});

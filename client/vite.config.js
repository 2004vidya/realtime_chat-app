import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ protocolImports: true }) // Polyfills for Node.js modules in the browser
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      path: "path-browserify", // Polyfill for 'path' module
      buffer: "buffer" // Polyfill for 'buffer' module
    },
  },
  build: {
    rollupOptions: {
      external: ["url", "express"], // Exclude server-side modules if needed
    },
  },
});

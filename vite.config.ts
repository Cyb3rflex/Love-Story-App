import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"    // esbuild-based React plugin
import path from "path"
import { componentTagger } from "lovable-tagger"

// Single default export
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(), // lovable-tagger only in dev
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))

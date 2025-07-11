import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const basepath = process.env.VITE_BASE_PATH || ''

export default defineConfig({
  server: {
    allowedHosts: true
  },
  base: basepath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

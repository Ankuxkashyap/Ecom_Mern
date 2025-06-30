import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  base: './', // optional: useful for GitHub Pages
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})

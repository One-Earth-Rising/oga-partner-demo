import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // ─── BASE PATH ───────────────────────────────────────────────────
  // When deploying as its own Netlify site: use '/'
  // When deploying under oga.oneearthrising.com/partners/kelloggs:
  //   change to '/partners/kelloggs/'
  base: '/',

  build: {
    outDir: 'dist',
  },
})

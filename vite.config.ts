import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The diagnostic is a fully client-side single-page app.
// `base` matches the GitHub Pages project path: https://<user>.github.io/it-career-diagnostic/
export default defineConfig({
  base: '/it-career-diagnostic/',
  plugins: [react()],
})

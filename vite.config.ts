import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The diagnostic is a fully client-side single-page app.
export default defineConfig({
  plugins: [react()],
})

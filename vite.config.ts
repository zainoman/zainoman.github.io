import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://odoosahab-al-zain-realestate-stage-18771559.dev.odoo.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
})
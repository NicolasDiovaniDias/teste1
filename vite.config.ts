import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    // Em desenvolvimento, as chamadas para /api vão para o back-end (pasta api, porta 3000)
    proxy: { '/api': 'http://localhost:3000' },
  },
  resolve: {
    alias: {
      // Permite importar com "@/..." em vez de "../../.."
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
